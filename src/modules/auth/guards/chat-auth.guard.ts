import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';

import { UserStatus } from '@/modules/user/domain/entities/user';

import { AuthUserReaderPort } from '../ports/auth-user-reader.port';
import { TelegrafContext } from '../types';

@Injectable()
export class ChatAuthGuard implements CanActivate {
  constructor(private readonly userReaderPort: AuthUserReaderPort) {}

  async canActivate(context: ExecutionContext) {
    const telegrafCtx = TelegrafExecutionContext.create(context);
    const ctx = telegrafCtx.getContext<TelegrafContext>();
    if (!ctx.from?.id) return false;
    const user = await this.userReaderPort.findUserByTgId(
      ctx.from.id.toString(),
    );
    if (!user) throw new TelegrafException('User not found');
    if (user.status !== UserStatus.ACTIVE) {
      throw new TelegrafException('Forbidden');
    }
    ctx.user = user;
    return true;
  }
}
