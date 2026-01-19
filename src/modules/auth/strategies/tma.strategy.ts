import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { parse, validate } from '@tma.js/init-data-node';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { AuthUserReaderPort } from '@/modules/auth/ports/auth-user-reader.port';
import { UserStatus } from '@/modules/user/domain/entities/user';

@Injectable()
export class TMAStrategy extends PassportStrategy(Strategy, 'tma') {
  private readonly logger = new Logger(TMAStrategy.name);
  constructor(
    private readonly config: ConfigService,
    private readonly userReaderPort: AuthUserReaderPort,
  ) {
    super();
  }

  async validate(req: Request) {
    const authHeader: string = req.headers['authorization'] ?? '';
    const [authType, authData = ''] = authHeader.split(' ');
    if (authType !== 'tma') return false;

    try {
      validate(authData, this.config.get('BOT_TOKEN', ''));
      const parsed = parse(authData);
      if (!parsed.user) return false;

      const user = await this.userReaderPort.findUserByTgId(
        parsed.user.id.toString(),
      );
      if (!user) return false;
      if (user.status !== UserStatus.ACTIVE) return false;
      return user;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }
}
