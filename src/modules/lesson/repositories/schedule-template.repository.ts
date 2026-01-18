import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';

import { ScheduleTemplateEntity } from '../domain/entities/schedule-template/schedule-template.entity';
import {
  BreakTime,
  IScheduleTemplate,
  IScheduleTemplateRule,
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
        rules: {
          create: data.rules,
        },
      },
      update: {
        ...data,
        rules: {
          deleteMany: {},
          create: data.rules,
        },
      },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<ScheduleTemplateEntity | null> {
    const template = await this.prisma.scheduleTemplate.findUnique({
      where: { id },
      include: { rules: true },
    });
    if (!template) return null;
    return ScheduleTemplateEntity.restore(this.mapToDomain(template));
  }

  async findAll(): Promise<ScheduleTemplateEntity[]> {
    const templates = await this.prisma.scheduleTemplate.findMany({
      include: { rules: true },
    });
    return templates.map((template) =>
      ScheduleTemplateEntity.restore(this.mapToDomain(template)),
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

  async delete(entity: ScheduleTemplateEntity): Promise<boolean> {
    const template = await this.prisma.scheduleTemplate.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!template;
  }

  private mapBreaks(breaks: unknown): BreakTime[] {
    if (!breaks || !Array.isArray(breaks)) return [];
    return breaks
      .filter(
        (b) => b && (b.startTime ?? b.start_time) && (b.endTime ?? b.end_time),
      )
      .map((b) => {
        const startRaw = b.startTime;
        const endRaw = b.endTime;
        return {
          startTime: new Date(startRaw),
          endTime: new Date(endRaw),
        } satisfies BreakTime;
      });
  }

  private mapToDomain(template: any): IScheduleTemplate {
    return {
      id: template.id,
      instructorId: template.instructorId,
      title: template.title,
      type: template.type,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      rules: ((template.rules ?? []) as IScheduleTemplateRule[]).map(
        (r: any): IScheduleTemplateRule => ({
          id: r.id,
          templateId:
            r.templateId ?? r.scheduleTemplateId ?? r.template_id ?? null,
          dayOfWeek: r.dayOfWeek ?? r.day_of_week ?? null,
          startTime: r.startTime,
          endTime: r.endTime,
          breaks: this.mapBreaks(r.breaks),
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      ),
    };
  }
}
