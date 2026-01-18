import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import { UserRoleType } from '@/modules/user/domain/entities/user';

import { SessionRepository } from '../repositories/session.repository';
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from '../types';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(userId: string, role: UserRoleType) {
    const code = nanoid(10);
    const sessionExpiredDate = dayjs().add(1, 'month').toDate();

    await this.sessionRepository.create({
      code,
      userId,
      expiredAt: sessionExpiredDate,
    });

    const accessToken = this.jwtService.sign<JwtAccessTokenPayload>({
      userId,
      role,
      iat: new Date().getTime(),
      exp: dayjs().add(15, 'minutes').unix(),
    });
    const refreshToken = this.jwtService.sign<JwtRefreshTokenPayload>({
      code,
      iat: new Date().getTime(),
      exp: sessionExpiredDate.getTime(),
    });

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }
}
