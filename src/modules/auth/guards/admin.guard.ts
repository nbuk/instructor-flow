import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Observable } from 'rxjs';

import { UserRole } from '@/modules/user/domain/entities/user';

import { TelegrafContext } from '../types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctxType = ctx.getType<'http' | 'telegraf'>();

    if (ctxType === 'telegraf') {
      const telegrafCtx =
        TelegrafExecutionContext.create(ctx).getContext<TelegrafContext>();
      return telegrafCtx.user?.role === UserRole.ADMIN;
    }

    if (ctxType === 'http') {
      const req = ctx.switchToHttp().getRequest();
      return req.user?.role === UserRole.ADMIN;
    }

    return false;
  }
}
