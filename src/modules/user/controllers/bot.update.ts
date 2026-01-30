import { UseGuards } from '@nestjs/common';
import { Ctx, Message, On, Update } from 'nestjs-telegraf';

import { PublicRoute } from '@/modules/auth/decorators/public-route.decorator';
import { User } from '@/modules/auth/decorators/user.decorator';
import { ChatAuthGuard } from '@/modules/auth/guards/chat-auth.guard';
import { type TelegrafContext, type UserAuthInfo } from '@/modules/auth/types';
import { CreateInstructorUseCase } from '@/modules/user/use-cases/create-instructor.use-case';

import { UserRole, type UserRoleType } from '../domain/entities/user';
import { CreateStudentUseCase } from '../use-cases/create-student.use-case';

@Update()
@PublicRoute()
@UseGuards(ChatAuthGuard)
export class BotUpdate {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly createInstructorUseCase: CreateInstructorUseCase,
  ) {}

  @On('text')
  async onText(@User('role') role: UserRoleType, @Ctx() ctx: TelegrafContext) {
    const baseMessage =
      'Чтобы воспользоваться приложением нажмите на кнопу "Открыть"';

    if (role === UserRole.STUDENT) {
      await ctx.reply(baseMessage, { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (role === UserRole.INSTRUCTOR) {
      await ctx.reply(baseMessage, {
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Добавить ученика',
                request_users: {
                  request_id: 1,
                  user_is_bot: false,
                  max_quantity: 1,
                },
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }

    if (role === UserRole.ADMIN) {
      await ctx.reply(baseMessage, {
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Добавить инструктора',
                request_users: {
                  request_id: 1,
                  user_is_bot: false,
                  max_quantity: 1,
                },
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }
  }

  @On('users_shared')
  async onShareUser(
    @Message('users_shared')
    sharedUser: { user_ids: number[]; request_id: number },
    @User() user: UserAuthInfo,
  ) {
    if (user.role === UserRole.INSTRUCTOR) {
      for (const tgId of sharedUser.user_ids) {
        await this.createStudentUseCase.execute(user, tgId.toString());
      }

      return 'Ученик добавлен';
    }

    if (user.role === UserRole.ADMIN) {
      for (const tgId of sharedUser.user_ids) {
        await this.createInstructorUseCase.execute(user, tgId.toString());
      }

      return 'Инструктор добавлен';
    }
  }
}
