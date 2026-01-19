import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import {
  ConflictException,
  ForbiddenException,
} from '@/libs/exceptions/exceptions';

import { LessonSlotEntity } from '../domain/entities/lesson/lesson-slot.entity';
import { DateRange } from '../domain/value-objects/date-range.vo';
import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class CreateLessonSlotUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(
    actorId: string,
    instructorId: string,
    startAt: Date,
    endAt: Date,
  ) {
    const allowed = await this.policy.canInstructorCreate(
      actorId,
      instructorId,
    );
    if (!allowed) {
      throw new ForbiddenException('Only instructors can create lesson slots');
    }
    const newLessonDateRange = new DateRange(startAt, endAt);

    const existingSlots = await this.getExistingSlots(instructorId, startAt);

    const hasOverlaps = existingSlots.some((slot) => {
      return slot.getDateRange().overlaps(newLessonDateRange);
    });

    if (hasOverlaps) {
      throw new ConflictException('Slot overlaps with existing slot');
    }

    const lessonSlot = LessonSlotEntity.create({
      instructorId,
      startAt,
      endAt,
    });
    await this.lessonSlotRepository.save(lessonSlot);
  }

  private getExistingSlots(instructorId: string, date: Date) {
    const startDate = dayjs(date).utc().startOf('day').toDate();
    const endDate = dayjs(date).utc().endOf('day').toDate();
    return this.lessonSlotRepository.findInstructorLessonsByDate(
      instructorId,
      startDate,
      endDate,
    );
  }
}
