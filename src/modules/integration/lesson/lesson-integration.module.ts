import { Module } from '@nestjs/common';

import { LessonUserReaderPort } from '@/modules/lesson/domain/ports/lesson-user-reader.port';
import { PrismaModule } from '@/modules/prisma';

import { LessonUserReaderAdapter } from './lesson-user-reader.adapter';

@Module({
  imports: [PrismaModule],
  providers: [
    LessonUserReaderAdapter,
    { provide: LessonUserReaderPort, useExisting: LessonUserReaderAdapter },
  ],
  exports: [LessonUserReaderPort],
})
export class LessonIntegrationModule {}
