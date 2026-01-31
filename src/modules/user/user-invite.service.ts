import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import {
  ConsumeTokenUseCase,
  CreateTokenUseCase,
} from '@/modules/action-token';
import { UserAuthInfo } from '@/modules/auth/types';

import { UserRole, UserRoleType } from './domain/entities/user';
import { CreateInstructorUseCase } from './use-cases/create-instructor.use-case';
import { CreateStudentUseCase } from './use-cases/create-student.use-case';

interface InviteTokenPayload {
  actor: UserAuthInfo;
  targetRole: UserRoleType;
}

@Injectable()
export class UserInviteService {
  constructor(
    private readonly createTokenUseCase: CreateTokenUseCase,
    private readonly consumeTokenUseCase: ConsumeTokenUseCase,
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly createInstructorUseCase: CreateInstructorUseCase,
  ) {}

  async createInviteToken(actor: UserAuthInfo, targetRole: UserRoleType) {
    return this.createTokenUseCase.execute({
      expiredAt: dayjs().add(24, 'hours').toDate(),
      isReusable: targetRole === UserRole.STUDENT,
      payload: { actor, targetRole },
    });
  }

  async acceptInvite(token: string, userTgId: string): Promise<UserRoleType> {
    const { actor, targetRole } =
      await this.consumeTokenUseCase.execute<InviteTokenPayload>(token);

    if (targetRole === UserRole.INSTRUCTOR) {
      await this.createInstructorUseCase.execute(actor, userTgId);
    }

    if (targetRole === UserRole.STUDENT) {
      await this.createStudentUseCase.execute(actor, userTgId);
    }

    return targetRole;
  }
}
