import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

import { UserRoleType } from '@/modules/user/domain/entities/user';

import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from '../types';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(
    userId: string,
    role: UserRoleType,
    sessionCode: string,
    sessionExpiredDate: Date,
  ) {
    const accessToken = this.jwtService.sign<JwtAccessTokenPayload>({
      userId,
      role,
      iat: new Date().getTime(),
      exp: dayjs().add(15, 'minutes').unix(),
    });
    const refreshToken = this.jwtService.sign<JwtRefreshTokenPayload>({
      code: sessionCode,
      iat: new Date().getTime(),
      exp: sessionExpiredDate.getTime(),
    });

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }
}
