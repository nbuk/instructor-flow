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
    err: any,
    session: ISession,
    _info: any,
    ctx: ExecutionContext,
  ): TUser {
    if (err || !session) {
      throw err || new UnauthorizedException();
    }
    const req = ctx.switchToHttp().getRequest();
    // Attach validated session to request for @Session() decorator
    req.session = session;
    // Also return a user-like object if needed by other decorators/guards
    return (session.user as unknown as TUser) ?? (session as unknown as TUser);
  }
}
