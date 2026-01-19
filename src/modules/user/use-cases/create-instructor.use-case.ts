import { Injectable } from '@nestjs/common';

import {
  ConflictException,
  ForbiddenException,
} from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { InstructorEntity } from '../domain/entities/instructor';
import { UserEntity, UserRole } from '../domain/entities/user';
import { AccessPolicy } from '../policies/access.policy';
import { UserUnitOfWork } from '../repositories/unit-of-work';

@Injectable()
export class CreateInstructorUseCase {
  constructor(
    private readonly uow: UserUnitOfWork,
    private readonly access: AccessPolicy,
  ) {}

  async execute(actor: UserAuthInfo, tgId: string) {
    const allowed = this.access.canAddInstructor(actor);
    if (!allowed) throw new ForbiddenException('forbidden');
    return this.uow.withTransaction(
      async ({ userRepository, instructorRepository }) => {
        const existedUser = await userRepository.findByTgId(tgId);
        if (existedUser) {
          throw new ConflictException('user with this tgId already exists', {
            clientMessage: 'Этот пользователь уже есть в базе',
          });
        }
        const user = UserEntity.create(tgId, UserRole.INSTRUCTOR);
        const instructor = InstructorEntity.create(user.getId());
        await userRepository.save(user);
        await instructorRepository.save(instructor);
      },
    );
  }
}
