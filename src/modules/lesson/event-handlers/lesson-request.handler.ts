import 'dayjs/locale/ru';

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

import { LessonRequestEvent } from '../domain/events/lesson-request.event';

@Injectable()
export class LessonRequestHandler {
  private readonly logger = new Logger(LessonRequestHandler.name);
  private readonly template: HandlebarsTemplateDelegate<{
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    date: string;
  }>;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userReader: LessonUserReaderPort,
    private readonly config: ConfigService,
  ) {
    const content = fs.readFileSync(
      path.join(this.config.get('TEMPLATES_PATH', ''), 'lesson-request.hbs'),
      'utf8',
    );
    this.template = Handlebars.compile(content);
  }

  @OnEvent(LessonRequestEvent.name)
  async handleLessonRequestEvent(event: LessonRequestEvent) {
    const { instructorId, studentId, date } = event;

    try {
      const student = await this.userReader.getUserInfoByStudentId(studentId);
      if (!student) {
        this.logger.warn('student not found', {
          studentId,
          event: LessonRequestEvent.name,
        });
        return;
      }

      const instructorUser =
        await this.userReader.getUserInfoByInstructorId(instructorId);
      if (!instructorUser) {
        this.logger.warn('user not found', {
          event: LessonRequestEvent.name,
          instructorId,
        });
        return;
      }

      const message = this.template({
        ...student.profile,
        date: dayjs(date).locale('ru').format('DD.MM.YY, dddd, HH:mm'),
      });

      await this.bot.telegram.sendMessage(instructorUser.tgId, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Открыть',
                web_app: {
                  url: `${this.config.get('WEB_APP_HOST')}/instructor/requests`,
                },
              },
            ],
          ],
        },
      });
    } catch (e) {
      this.logger.error(e, 'an error occurred while sending message');
    }
  }
}
