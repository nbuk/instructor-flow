import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';
import { PrismaTx } from '@/modules/prisma/prisma.service';

import { StudentEntity } from '../domain/entities/student';

@Injectable()
export class StudentRepository extends RepositoryBase<StudentEntity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(entity: StudentEntity): Promise<void> {
    const data = entity.serialize();
    await this.prisma.student.upsert({
      where: { id: data.id },
      create: {
        ...data,
        firstNameNorm: data.firstName?.toLowerCase(),
        middleNameNorm: data.middleName?.toLowerCase(),
        lastNameNorm: data.lastName?.toLowerCase(),
      },
      update: {
        ...data,
        firstNameNorm: data.firstName?.toLowerCase(),
        middleNameNorm: data.middleName?.toLowerCase(),
        lastNameNorm: data.lastName?.toLowerCase(),
      },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) return null;
    return StudentEntity.restore(student);
  }

  async findByUserId(userId: string): Promise<StudentEntity | null> {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) return null;
    return StudentEntity.restore(student);
  }

  async findAll(): Promise<StudentEntity[]> {
    const students = await this.prisma.student.findMany();
    return students.map((student) => StudentEntity.restore(student));
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<StudentEntity>> {
    const { limit, offset, orderBy } = params;
    const students = await this.prisma.student.findMany({
      orderBy: { [orderBy.field]: orderBy.param },
      take: limit,
      skip: offset,
    });
    const totalCount = await this.prisma.student.count();
    return {
      limit,
      offset,
      totalCount,
      data: students.map((student) => StudentEntity.restore(student)),
    };
  }

  async delete(entity: StudentEntity): Promise<boolean> {
    const student = await this.prisma.student.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!student;
  }
}

export class StudentRepositoryTx extends StudentRepository {
  constructor(tx: PrismaTx, eventEmitter: EventEmitter2) {
    super(tx as PrismaService, eventEmitter);
  }
}
