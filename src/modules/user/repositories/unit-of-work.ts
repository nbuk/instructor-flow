import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UnitOfWork } from '@/libs/database/unit-of-work.base';
import { PrismaService } from '@/modules/prisma';

import {
  InstructorRepository,
  InstructorRepositoryTx,
} from './instructor.repository';
import { StudentRepository, StudentRepositoryTx } from './student.repository';
import { UserRepository, UserRepositoryTx } from './user.repository';

type UnitOfWorkContext = {
  userRepository: UserRepository;
  instructorRepository: InstructorRepository;
  studentRepository: StudentRepository;
};

@Injectable()
export class UserUnitOfWork extends UnitOfWork {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async withTransaction<T>(
    work: (ctx: UnitOfWorkContext) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const ctx: UnitOfWorkContext = {
        userRepository: new UserRepositoryTx(tx, this.eventEmitter),
        instructorRepository: new InstructorRepositoryTx(tx, this.eventEmitter),
        studentRepository: new StudentRepositoryTx(tx, this.eventEmitter),
      };

      return work(ctx);
    });
  }
}
