import { Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma';
import { UserLessonReaderPort } from '@/modules/user/domain/ports/user-lesson-reader.port';

import { UserLessonReaderAdapter } from './user-lesson-reader.adapter';

@Module({
  imports: [PrismaModule],
  providers: [
    UserLessonReaderAdapter,
    {
      provide: UserLessonReaderPort,
      useExisting: UserLessonReaderAdapter,
    },
  ],
  exports: [UserLessonReaderPort],
})
export class UserIntegrationModule {}
