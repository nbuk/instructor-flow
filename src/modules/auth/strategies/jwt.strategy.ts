import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUserReaderPort } from '@/modules/auth/ports/auth-user-reader.port';
import { JwtAccessTokenPayload } from '@/modules/auth/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly userReaderPort: AuthUserReaderPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', ''),
    });
  }

  async validate(payload: JwtAccessTokenPayload) {
    const user = await this.userReaderPort.findUser(payload.userId);
    if (!user) return false;
    return user;
  }
}
