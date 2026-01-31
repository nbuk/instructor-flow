import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command, Ctx, Hears, Message, On, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

import { PublicRoute } from '@/modules/auth/decorators/public-route.decorator';
import { User } from '@/modules/auth/decorators/user.decorator';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { ChatAuthGuard } from '@/modules/auth/guards/chat-auth.guard';
import { InstructorGuard } from '@/modules/auth/guards/instructor.guard';
import { type TelegrafContext, type UserAuthInfo } from '@/modules/auth/types';

import { UserRole, type UserRoleType } from '../domain/entities/user';
import { CreateInstructorUseCase } from '../use-cases/create-instructor.use-case';
import { CreateStudentUseCase } from '../use-cases/create-student.use-case';
import { UserInviteService } from '../user-invite.service';

@Update()
@PublicRoute()
export class BotUpdate {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly createInstructorUseCase: CreateInstructorUseCase,
    private readonly inviteService: UserInviteService,
    private readonly config: ConfigService,
  ) {}

  @Command('start')
  async onStart(
    @Message('text') messageText: string,
    @Message('from') from: { id: number },
    @Ctx() ctx: TelegrafContext,
  ) {
    const inviteToken = messageText?.split(' ')[1];
    if (!inviteToken) return;
    const role = await this.inviteService.acceptInvite(
      inviteToken,
      from.id.toString(),
    );
    await this.sendGreetingMessage(role, ctx);
  }

  @UseGuards(ChatAuthGuard, InstructorGuard)
  @Hears('Создать ссылку-приглашение для учеников')
  async onCreateStudentInvite(
    @User() user: UserAuthInfo,
    @Ctx() ctx: TelegrafContext,
  ) {
    const token = await this.inviteService.createInviteToken(
      user,
      UserRole.STUDENT,
    );
    const inviteLink = `https://t.me/${this.config.get('BOT_USERNAME')}?start=${token}`;
    await ctx.replyWithHTML(
      `Ваша ссылка для приглашения учеников:\n\n<code>${inviteLink}</code>\n\nСсылка действительна в течение 24 часов.`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Markup.inlineKeyboard([
        [{ text: 'Скопировать ссылку', copy_text: { text: inviteLink } }],
      ]),
    );
  }

  @UseGuards(ChatAuthGuard, AdminGuard)
  @Hears('Создать ссылку-приглашение для инструктора')
  async onCreateInstructorInvite(
    @User() user: UserAuthInfo,
    @Ctx() ctx: TelegrafContext,
  ) {
    const token = await this.inviteService.createInviteToken(
      user,
      UserRole.INSTRUCTOR,
    );
    const inviteLink = `https://t.me/${this.config.get('BOT_USERNAME')}?start=${token}`;
    await ctx.replyWithHTML(
      `Ссылка для приглашения инструктора:\n\n<code>${inviteLink}</code>\n\nСсылка действительна в течение 24 часов.`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Markup.inlineKeyboard([
        [{ text: 'Скопировать ссылку', copy_text: { text: inviteLink } }],
      ]),
    );
  }

  @UseGuards(ChatAuthGuard)
  @On('text')
  async onText(@User('role') role: UserRoleType, @Ctx() ctx: TelegrafContext) {
    await this.sendGreetingMessage(role, ctx);
  }

  @UseGuards(ChatAuthGuard)
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

  private async sendGreetingMessage(role: UserRoleType, ctx: TelegrafContext) {
    const baseMessage =
      'Чтобы воспользоваться приложением нажмите на кнопу "Открыть"';

    if (role === UserRole.STUDENT) {
      await ctx.reply(baseMessage, { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (role === UserRole.INSTRUCTOR) {
      await ctx.telegram.setMyCommands([
        {
          command: 'create_invite_link',
          description: 'Создать ссылку для приглашения учеников',
        },
      ]);
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
            [{ text: 'Создать ссылку-приглашение для учеников' }],
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
            [
              {
                text: 'Создать ссылку-приглашение для инструктора',
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }
  }
}
