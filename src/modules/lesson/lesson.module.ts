import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth';
import { LessonIntegrationModule } from '@/modules/integration/lesson';
import { PrismaModule } from '@/modules/prisma';

import { ScheduleController } from './controllers/schedule.controller';
import { TemplateController } from './controllers/template.controller';
import { eventHandlers } from './event-handlers';
import { LessonAccessPolicy } from './policies/lesson-access.policy';
import { LessonRequestReadRepository } from './repositories/lesson-request-read.repository';
import { LessonSlotRepository } from './repositories/lesson-slot.repository';
import { ScheduleTemplateRepository } from './repositories/schedule-template.repository';
import { lessonUseCases } from './use-cases';

@Module({
  imports: [PrismaModule, AuthModule, LessonIntegrationModule],
  providers: [
    LessonSlotRepository,
    LessonRequestReadRepository,
    ScheduleTemplateRepository,
    LessonAccessPolicy,
    ...lessonUseCases,
    ...eventHandlers,
  ],
  controllers: [ScheduleController, TemplateController],
  exports: [LessonRequestReadRepository],
})
export class LessonModule {}
