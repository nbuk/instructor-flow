import { createParamDecorator } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

import { TelegrafContext, UserAuthInfo } from '@/modules/auth/types';

export const User = createParamDecorator(
  (
    key: keyof UserAuthInfo,
    ctx,
  ): UserAuthInfo | UserAuthInfo[keyof UserAuthInfo] | undefined => {
    const ctxType = ctx.getType<'http' | 'ws' | 'telegraf'>();
    let user: UserAuthInfo | undefined;

    if (ctxType === 'http') user = ctx.switchToHttp().getRequest().user;
    if (ctxType === 'telegraf') {
      user =
        TelegrafExecutionContext.create(ctx).getContext<TelegrafContext>()
          ?.user;
    }

    if (key && user) return user[key];
    return user;
  },
);
