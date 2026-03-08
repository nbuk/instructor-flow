import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import fs from 'fs';
import Handlebars from 'handlebars';
import { InjectBot } from 'nestjs-telegraf';
import path from 'path';
import { Telegraf } from 'telegraf';

import { LessonRequestRejectedEvent } from '../domain/events';
import { LessonUserReaderPort } from '../domain/ports/lesson-user-reader.port';

@Injectable()
export class LessonRequestRejectedInstructorGroupHandler {
  private readonly logger = new Logger(
    LessonRequestRejectedInstructorGroupHandler.name,
  );
  private readonly template: HandlebarsTemplateDelegate<{ date: string }>;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userReader: LessonUserReaderPort,
    private readonly config: ConfigService,
  ) {
    const content = fs.readFileSync(
      path.join(
        this.config.get('TEMPLATES_PATH', ''),
        'lesson-slot-freed.hbs',
      ),
      'utf8',
    );
    this.template = Handlebars.compile(content);
  }

  @OnEvent(LessonRequestRejectedEvent.name)
  async handleLessonRequestRejectedEvent(event: LessonRequestRejectedEvent) {
    const { instructorId, date, timezone } = event;
    const instructor = await this.userReader.getUserInfoByInstructorId(
      instructorId,
    );
    if (!instructor) {
      this.logger.warn('instructor not found', {
        instructorId,
        event: LessonRequestRejectedEvent.name,
      });
      return;
    }
    const groupChatId = instructor.profile.groupChatId;
    if (!groupChatId) {
      this.logger.debug('instructor has no group chat', {
        instructorId,
        event: LessonRequestRejectedEvent.name,
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
      await this.bot.telegram.sendMessage(groupChatId, message, {
        parse_mode: 'HTML',
      });
    } catch (e) {
      this.logger.error(e, 'an error occurred while sending message to group');
    }
  }
}
