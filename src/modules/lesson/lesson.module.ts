import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth';
import { LessonIntegrationModule } from '@/modules/integration/lesson';
import { PrismaModule } from '@/modules/prisma';

import { ScheduleController } from './controllers/schedule.controller';
import { eventHandlers } from './event-handlers';
import { LessonAccessPolicy } from './policies/lesson-access.policy';
import { LessonRequestReadRepository } from './repositories/lesson-request-read.repository';
import { LessonSlotRepository } from './repositories/lesson-slot.repository';
import { lessonUseCases } from './use-cases';

@Module({
  imports: [PrismaModule, AuthModule, LessonIntegrationModule],
  providers: [
    LessonSlotRepository,
    LessonRequestReadRepository,
    LessonAccessPolicy,
    ...lessonUseCases,
    ...eventHandlers,
  ],
  controllers: [ScheduleController],
  exports: [LessonRequestReadRepository],
})
export class LessonModule {}
