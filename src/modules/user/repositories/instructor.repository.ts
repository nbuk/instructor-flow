import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';
import { PrismaTx } from '@/modules/prisma/prisma.service';

import { InstructorEntity } from '../domain/entities/instructor';

@Injectable()
export class InstructorRepository extends RepositoryBase<InstructorEntity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(entity: InstructorEntity): Promise<void> {
    const data = entity.serialize();
    if (data.car) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete data.car.instructorId;
    }

    await this.prisma.instructor.upsert({
      where: { id: data.id },
      create: {
        ...data,
        car: {},
      },
      update: {
        ...data,
        car: {
          ...(!!data.car && {
            upsert: {
              where: { id: data.car.id },
              create: data.car,
              update: data.car,
            },
          }),
        },
      },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<InstructorEntity | null> {
    const instructor = await this.prisma.instructor.findUnique({
      where: { id },
      include: { car: true },
    });
    if (!instructor) return null;
    return InstructorEntity.restore(instructor);
  }

  async findByUserId(userId: string): Promise<InstructorEntity | null> {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: { car: true },
    });
    if (!instructor) return null;
    return InstructorEntity.restore(instructor);
  }

  async findAll(): Promise<InstructorEntity[]> {
    const instructors = await this.prisma.instructor.findMany({
      include: { car: true },
    });
    return instructors.map((instructor) =>
      InstructorEntity.restore(instructor),
    );
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<InstructorEntity>> {
    const { limit, offset, orderBy } = params;
    const instructors = await this.prisma.instructor.findMany({
      include: { car: true },
      orderBy: { [orderBy.field]: orderBy.param },
      take: limit,
      skip: offset,
    });
    const totalCount = await this.prisma.instructor.count();
    return {
      limit,
      offset,
      totalCount,
      data: instructors.map((instructor) =>
        InstructorEntity.restore(instructor),
      ),
    };
  }

  async delete(entity: InstructorEntity): Promise<boolean> {
    const instructor = await this.prisma.instructor.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!instructor;
  }
}

export class InstructorRepositoryTx extends InstructorRepository {
  constructor(prisma: PrismaTx, eventEmitter: EventEmitter2) {
    super(prisma as PrismaService, eventEmitter);
  }
}
