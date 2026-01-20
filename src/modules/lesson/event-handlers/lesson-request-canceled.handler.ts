import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import fs from 'fs';
import Handlebars from 'handlebars';
import { InjectBot } from 'nestjs-telegraf';
import path from 'path';
import { Telegraf } from 'telegraf';

import { LessonRequestCanceledEvent } from '../domain/events';
import { LessonUserReaderPort } from '../domain/ports/lesson-user-reader.port';

@Injectable()
export class LessonRequestCanceledHandler {
  private readonly logger = new Logger(LessonRequestCanceledHandler.name);
  private readonly template: HandlebarsTemplateDelegate<{ date: string }>;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userReader: LessonUserReaderPort,
    private readonly config: ConfigService,
  ) {
    const content = fs.readFileSync(
      path.join(
        this.config.get('TEMPLATES_PATH', ''),
        'lesson-request-canceled.hbs',
      ),
      'utf8',
    );
    this.template = Handlebars.compile(content);
  }

  @OnEvent(LessonRequestCanceledEvent.name)
  async handleLessonRequestCanceledEvent(event: LessonRequestCanceledEvent) {
    const { studentId, date, timezone } = event;
    const user = await this.userReader.getUserInfoByStudentId(studentId);
    if (!user) {
      this.logger.warn('user not found', {
        studentId,
        event: LessonRequestCanceledEvent.name,
      });
      return;
    }

    try {
      const message = this.template({
        date: dayjs(date)
          .tz(timezone)
          .locale('ru')
          .format('DD.MM.YY, dddd, HH:mm'),
      });
      await this.bot.telegram.sendMessage(user.tgId, message, {
        parse_mode: 'HTML',
      });
    } catch (e) {
      this.logger.error(e, 'an error occurred while sending message');
    }
  }
}
