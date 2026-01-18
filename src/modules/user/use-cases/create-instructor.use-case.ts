import { Injectable } from '@nestjs/common';

import { InstructorEntity } from '../domain/entities/instructor';
import { UserEntity, UserRole } from '../domain/entities/user';
import { UserUnitOfWork } from '../repositories/unit-of-work';

@Injectable()
export class CreateInstructorUseCase {
  constructor(private readonly uow: UserUnitOfWork) {}

  async execute(tgId: string) {
    return this.uow.withTransaction(
      async ({ userRepository, instructorRepository }) => {
        const user = UserEntity.create(tgId, UserRole.INSTRUCTOR);
        const instructor = InstructorEntity.create(user.getId());
        await userRepository.save(user);
        await instructorRepository.save(instructor);
      },
    );
  }
}
