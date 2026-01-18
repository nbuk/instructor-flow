import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import { UserRoleType } from '@/modules/user/domain/entities/user';

import { SessionRepository } from '../repositories/session.repository';
import { ISession } from '../types';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(
    session: ISession,
  ): Promise<{ userId: string; role: UserRoleType }> {
    const {
      user: { id, role },
    } = await this.sessionRepository.update(session.id, {
      code: nanoid(10),
      expiredAt: dayjs().add(1, 'month').toDate(),
    });
    return { userId: id, role };
  }
}
