import { Injectable } from '@nestjs/common';

import {
  ConflictException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import { StudentEntity } from '../domain/entities/student';
import { UserEntity, UserRole } from '../domain/entities/user';
import { UserUnitOfWork } from '../repositories/unit-of-work';

@Injectable()
export class CreateStudentUseCase {
  constructor(private readonly uow: UserUnitOfWork) {}

  async execute(actorUserId: string, studentTgId: string) {
    return await this.uow.withTransaction(
      async ({ userRepository, studentRepository, instructorRepository }) => {
        const existedUser = await userRepository.findByTgId(studentTgId);
        if (existedUser) {
          throw new ConflictException('Student with this tgId already exists', {
            clientMessage: 'Ученик уже добавлен',
          });
        }
        const instructor = await instructorRepository.findByUserId(actorUserId);
        if (!instructor) throw new NotFoundException('Instructor not found');
        const user = UserEntity.create(studentTgId, UserRole.STUDENT);
        const student = StudentEntity.create(user.getId(), instructor.getId());
        await userRepository.save(user);
        await studentRepository.save(student);
      },
    );
  }
}
