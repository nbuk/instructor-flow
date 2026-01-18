import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtRefreshTokenPayload } from '../types';
import { FindSessionUseCase } from '../use-cases/find-session.use-case';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    config: ConfigService,
    private readonly findSessionUseCase: FindSessionUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', ''),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtRefreshTokenPayload) {
    const session = await this.findSessionUseCase.execute(payload.code);
    if (!session) return false;
    return session;
  }
}

const cookieExtractor = (req: any) => {
  if (req && req.cookies) {
    return req.cookies['refreshToken']?.replace('Bearer ', '');
  }
  return null;
};
