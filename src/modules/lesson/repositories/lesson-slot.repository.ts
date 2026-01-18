import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import dayjs from 'dayjs';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { ILessonRequest } from '@/modules/lesson/domain/entities/lesson/types';
import { PrismaService } from '@/modules/prisma';

import { LessonRequestStatus } from '../../../../generated/prisma/enums';
import { LessonSlotEntity } from '../domain/entities/lesson/lesson-slot.entity';

@Injectable()
export class LessonSlotRepository extends RepositoryBase<LessonSlotEntity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(entity: LessonSlotEntity): Promise<void> {
    const data = entity.serialize();
    const requests = data.requests.map(
      (
        request: Omit<ILessonRequest, 'lessonSlotId'> & {
          lessonSlotId?: string;
        },
      ) => {
        delete request.lessonSlotId;
        return request;
      },
    );
    await this.prisma.lessonSlot.upsert({
      where: { id: data.id },
      create: {
        ...data,
        requests: {
          createMany: { data: requests },
        },
      },
      update: {
        ...data,
        requests: {
          deleteMany: {},
          createMany: { data: requests },
        },
      },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<LessonSlotEntity | null> {
    const slot = await this.prisma.lessonSlot.findUnique({
      where: { id },
      include: { requests: true },
    });
    if (!slot) return null;
    return LessonSlotEntity.restore(slot);
  }

  async findAll(): Promise<LessonSlotEntity[]> {
    const slots = await this.prisma.lessonSlot.findMany({
      include: { requests: true },
    });
    return slots.map((slot) => LessonSlotEntity.restore(slot));
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<LessonSlotEntity>> {
    const { limit, offset, orderBy } = params;
    const slots = await this.prisma.lessonSlot.findMany({
      include: { requests: true },
      orderBy: { [orderBy.field]: orderBy.param },
      take: limit,
      skip: offset,
    });
    const totalCount = await this.prisma.lessonSlot.count();
    return {
      limit,
      offset,
      totalCount,
      data: slots.map((slot) => LessonSlotEntity.restore(slot)),
    };
  }

  async findInstructorLessonsByDate(instructorId: string, date: Date) {
    const start = dayjs(date).startOf('day');
    const end = dayjs(start).endOf('day');

    const slots = await this.prisma.lessonSlot.findMany({
      include: { requests: true },
      where: {
        instructorId,
        startAt: { lt: end.toDate() },
        endAt: { gt: start.toDate() },
      },
    });
    return slots.map((slot) => LessonSlotEntity.restore(slot));
  }

  async findStudentUpcomingLessons(studentId: string, timezone: string) {
    const slots = await this.prisma.lessonSlot.findMany({
      where: {
        requests: {
          some: {
            studentId,
            status: {
              in: [LessonRequestStatus.PENDING, LessonRequestStatus.APPROVED],
            },
          },
        },
        startAt: { gte: dayjs().tz(timezone).startOf('day').toDate() },
      },
      include: { requests: true },
    });

    return slots.map((slot) => LessonSlotEntity.restore(slot));
  }

  async delete(entity: LessonSlotEntity): Promise<boolean> {
    const slot = await this.prisma.lessonSlot.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!slot;
  }
}
