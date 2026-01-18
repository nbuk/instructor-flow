import { Injectable } from '@nestjs/common';

import { LessonRequestStatus } from '@/modules/lesson/domain/entities/lesson/types';
import { PrismaService } from '@/modules/prisma';
import {
  LessonInfo,
  UserLessonReaderPort,
} from '@/modules/user/domain/ports/user-lesson-reader.port';

@Injectable()
export class UserLessonReaderAdapter implements UserLessonReaderPort {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentLessons(
    studentId: string,
    upcoming: boolean,
  ): Promise<LessonInfo[]> {
    return this.prisma.lessonSlot.findMany({
      where: {
        startAt: upcoming ? { gte: new Date() } : { lte: new Date() },
        requests: {
          some: {
            studentId,
            status: LessonRequestStatus.APPROVED,
          },
        },
      },
    });
  }
}
