import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import fs from 'fs';
import Handlebars from 'handlebars';
import { InjectBot } from 'nestjs-telegraf';
import path from 'path';
import { Telegraf } from 'telegraf';

import { LessonUserReaderPort } from '@/modules/lesson/domain/ports/lesson-user-reader.port';

import { LessonRequestRejectedEvent } from '../domain/events';

@Injectable()
export class LessonRequestRejectedHandler {
  private readonly logger = new Logger(LessonRequestRejectedHandler.name);
  private readonly template: HandlebarsTemplateDelegate<{ date: string }>;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userReader: LessonUserReaderPort,
    private readonly config: ConfigService,
  ) {
    const content = fs.readFileSync(
      path.join(
        this.config.get('TEMPLATES_PATH', ''),
        'lesson-request-rejected.hbs',
      ),
      'utf8',
    );
    this.template = Handlebars.compile(content);
  }

  @OnEvent(LessonRequestRejectedEvent.name)
  async handleLessonRequestRejectedEvent(event: LessonRequestRejectedEvent) {
    const { studentId, date } = event;

    try {
      const user = await this.userReader.getUserInfoByStudentId(studentId);
      if (!user) {
        this.logger.warn('user not found', {
          studentId,
          event: LessonRequestRejectedEvent.name,
        });
        return;
      }

      const message = this.template({
        date: dayjs(date).locale('ru').format('DD.MM.YY, dddd, HH:mm'),
      });
      await this.bot.telegram.sendMessage(user.tgId, message, {
        parse_mode: 'HTML',
      });
    } catch (e) {
      this.logger.error(e, 'an error occurred while sending message');
    }
  }
}
