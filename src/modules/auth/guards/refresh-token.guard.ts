import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ISession } from '../types';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  handleRequest<TUser = any>(
    err,
    session: ISession,
    info,
    ctx: ExecutionContext,
  ): TUser {
    if (err || !session) {
      throw err || new UnauthorizedException();
    }
    const req = ctx.switchToHttp().getRequest();
    req.session = session;
    return session.user as TUser;
  }
}
