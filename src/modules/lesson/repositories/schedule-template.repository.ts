import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';

import { InputJsonValue } from '../../../../generated/prisma/internal/prismaNamespace';
import { ScheduleTemplateEntity } from '../domain/entities/schedule-template/schedule-template.entity';
import {
  IScheduleTemplate,
  IScheduleTemplateDayRule,
  TemplateRuleBreak,
} from '../domain/entities/schedule-template/types';

@Injectable()
export class ScheduleTemplateRepository extends RepositoryBase<ScheduleTemplateEntity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(entity: ScheduleTemplateEntity): Promise<void> {
    const data = entity.serialize();
    await this.prisma.scheduleTemplate.upsert({
      where: { id: data.id },
      create: {
        ...data,
        defaultRules: {
          ...data.defaultRules,
          breaks: data.defaultRules.breaks as unknown as InputJsonValue,
        },
        rules: {
          create: data.rules.map((r) => ({
            ...r,
            breaks: r.breaks as unknown as InputJsonValue,
          })),
        },
      },
      update: {
        ...data,
        defaultRules: {
          ...data.defaultRules,
          breaks: data.defaultRules.breaks as unknown as InputJsonValue,
        },
        rules: {
          deleteMany: {},
          create: data.rules.map((r) => ({
            ...r,
            breaks: r.breaks as unknown as InputJsonValue,
          })),
        },
      },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<ScheduleTemplateEntity | null> {
    const template = await this.prisma.scheduleTemplate.findUnique({
      where: { id: id },
      include: { rules: true },
    });
    if (!template) return null;
    return ScheduleTemplateEntity.restore(this.mapToDomain(template));
  }

  async findAll() {
    const templates = await this.prisma.scheduleTemplate.findMany({
      include: { rules: true },
    });
    return templates.map((t) =>
      ScheduleTemplateEntity.restore(this.mapToDomain(t)),
    );
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<ScheduleTemplateEntity>> {
    const { limit, offset, orderBy } = params;
    const templates = await this.prisma.scheduleTemplate.findMany({
      orderBy: { [orderBy.field]: orderBy.param },
      take: limit,
      skip: offset,
      include: { rules: true },
    });
    const totalCount = await this.prisma.scheduleTemplate.count();
    return {
      offset,
      limit,
      totalCount,
      data: templates.map((template) =>
        ScheduleTemplateEntity.restore(this.mapToDomain(template)),
      ),
    };
  }

  async findAllByInstructorId(
    instructorId: string,
  ): Promise<ScheduleTemplateEntity[]> {
    const templates = await this.prisma.scheduleTemplate.findMany({
      where: { instructorId },
    });
    return templates.map((t) =>
      ScheduleTemplateEntity.restore(this.mapToDomain(t)),
    );
  }

  async delete(entity: ScheduleTemplateEntity): Promise<boolean> {
    const template = await this.prisma.scheduleTemplate.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!template;
  }

  private mapBreaks(breaks: unknown): TemplateRuleBreak[] {
    if (!breaks || !Array.isArray(breaks)) return [];
    return breaks.map((b) => {
      return {
        startTime: b.startTime,
        endTime: b.endTime,
      };
    });
  }

  private mapToDomain(template: any): IScheduleTemplate {
    return {
      id: template.id,
      instructorId: template.instructorId,
      title: template.title,
      defaultRules: template.defaultRules,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      timezone: template.timezone,
      rules: ((template.rules ?? []) as IScheduleTemplateDayRule[]).map(
        (r): IScheduleTemplateDayRule => ({
          id: r.id,
          weekday: r.weekday ?? r.weekday ?? null,
          startTime: r.startTime,
          endTime: r.endTime,
          breaks: this.mapBreaks(r.breaks),
          slotDurationMinutes: r.slotDurationMinutes,
          slotGapMinutes: r.slotGapMinutes,
        }),
      ),
    };
  }
}
