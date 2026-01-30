import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import { LessonSlotEntity } from '../domain/entities/lesson/lesson-slot.entity';
import { IScheduleTemplateDayRule } from '../domain/entities/schedule-template/types';
import { DateRange } from '../domain/value-objects/date-range.vo';
import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';
import { ScheduleTemplateRepository } from '../repositories/schedule-template.repository';

dayjs.extend(utc);
dayjs.extend(timezone);

interface CreateScheduleFromTemplateParams {
  actorId: string;
  templateId: string;
  startDate: Date;
  endDate: Date;
}

interface TimeSlot {
  startAt: Date;
  endAt: Date;
}

@Injectable()
export class CreateScheduleFromTemplateUseCase {
  constructor(
    private readonly templateRepository: ScheduleTemplateRepository,
    private readonly slotRepository: LessonSlotRepository,
    private readonly access: LessonAccessPolicy,
  ) {}

  async execute(params: CreateScheduleFromTemplateParams) {
    const { actorId, templateId, startDate, endDate } = params;

    const template = await this.templateRepository.findById(templateId);
    if (!template) throw new NotFoundException('template not found');

    const allowed = await this.access.canCreateScheduleFromTemplate(
      actorId,
      template,
    );
    if (!allowed) throw new ForbiddenException('forbidden');

    const templateData = template.serialize();
    const instructorId = template.getInstructorId();

    // Получить существующие уроки инструктора в диапазоне дат
    const existingSlots = await this.slotRepository.findInstructorLessonsByDate(
      instructorId,
      startDate,
      endDate,
    );

    // Генерация слотов из шаблона
    const newSlots: LessonSlotEntity[] = [];
    let currentDate = dayjs(startDate).tz(templateData.timezone);
    const end = dayjs(endDate).tz(templateData.timezone);

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      const weekday = currentDate.day();
      const rule = templateData.rules.find((r) => r.weekday === weekday);

      if (rule) {
        const slots = this.generateSlotsForDay(
          currentDate,
          rule,
          templateData.timezone,
        );

        for (const slot of slots) {
          if (!this.hasConflict(slot, existingSlots, rule.slotGapMinutes)) {
            const lessonSlot = LessonSlotEntity.create({
              instructorId,
              startAt: slot.startAt,
              endAt: slot.endAt,
              timezone: templateData.timezone,
            });
            newSlots.push(lessonSlot);
          }
        }
      }

      currentDate = currentDate.add(1, 'day');
    }

    // Сохранить все новые слоты
    for (const slot of newSlots) {
      await this.slotRepository.save(slot);
    }

    return { created: newSlots.length };
  }

  /**
   * Парсит время в формате "HH:mm" и создает Date для конкретного дня
   */
  private parseTime(date: dayjs.Dayjs, time: string, tz: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    return date.hour(hours).minute(minutes).second(0).millisecond(0).toDate();
  }

  /**
   * Проверяет, попадает ли временной слот в период перерыва
   * Если да — возвращает конец перерыва, иначе null
   */
  private isInBreak(
    slotStart: Date,
    slotEnd: Date,
    breaks: Array<{ startTime: string; endTime: string }>,
    date: dayjs.Dayjs,
    tz: string,
  ): Date | null {
    for (const breakPeriod of breaks) {
      const breakStart = this.parseTime(date, breakPeriod.startTime, tz);
      const breakEnd = this.parseTime(date, breakPeriod.endTime, tz);

      // Проверка пересечения с перерывом
      if (slotStart < breakEnd && slotEnd > breakStart) {
        return breakEnd;
      }
    }
    return null;
  }

  /**
   * Генерирует слоты для одного дня на основе правила шаблона
   */
  private generateSlotsForDay(
    date: dayjs.Dayjs,
    rule: IScheduleTemplateDayRule,
    tz: string,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayStart = this.parseTime(date, rule.startTime, tz);
    const dayEnd = this.parseTime(date, rule.endTime, tz);

    let currentTime = dayjs(dayStart).tz(tz);
    const endTime = dayjs(dayEnd).tz(tz);

    console.log(endTime.toDate());

    while (
      currentTime.add(rule.slotDurationMinutes, 'minute').isBefore(endTime) ||
      currentTime.add(rule.slotDurationMinutes, 'minute').isSame(endTime)
    ) {
      const slotStart = currentTime.toDate();
      const slotEnd = currentTime
        .add(rule.slotDurationMinutes, 'minute')
        .toDate();

      // Проверка на пересечение с перерывами
      const breakOverlapEnd = this.isInBreak(
        slotStart,
        slotEnd,
        rule.breaks,
        date,
        tz,
      );
      if (breakOverlapEnd) {
        // Если слот попал на перерыв — передвигаем текущее время на конец перерыва
        currentTime = dayjs(breakOverlapEnd).tz(tz);
      } else {
        // Слот валиден — добавляем и переходим к следующему с учетом gap
        slots.push({ startAt: slotStart, endAt: slotEnd });
        currentTime = currentTime.add(
          rule.slotDurationMinutes + rule.slotGapMinutes,
          'minute',
        );
      }

      console.log(currentTime);
    }

    return slots;
  }

  /**
   * Проверяет наличие конфликта нового слота с существующими
   */
  private hasConflict(
    newSlot: TimeSlot,
    existingSlots: LessonSlotEntity[],
    gapMinutes: number,
  ): boolean {
    const newRange = new DateRange(newSlot.startAt, newSlot.endAt);

    for (const existingSlot of existingSlots) {
      const existingRange = existingSlot.getDateRange();

      // Проверка прямого пересечения
      if (newRange.overlaps(existingRange)) {
        return true;
      }

      // Проверка минимального интервала между уроками
      const existingEnd = existingRange.getValue().endTime;
      const existingStart = existingRange.getValue().startTime;

      // Новый урок начинается раньше, чем закончился существующий + gap
      const minStartAfterExisting = dayjs(existingEnd)
        .add(gapMinutes, 'minute')
        .toDate();
      if (
        newSlot.startAt < minStartAfterExisting &&
        newSlot.endAt > existingStart
      ) {
        return true;
      }

      // Существующий урок начинается раньше, чем закончился новый + gap
      const minStartAfterNew = dayjs(newSlot.endAt)
        .add(gapMinutes, 'minute')
        .toDate();
      if (existingStart < minStartAfterNew && existingEnd > newSlot.startAt) {
        return true;
      }
    }

    return false;
  }
}
