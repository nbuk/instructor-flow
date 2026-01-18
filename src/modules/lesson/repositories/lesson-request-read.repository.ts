import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma';

import { LessonRequestStatus } from '../domain/entities/lesson/types';

@Injectable()
export class LessonRequestReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  getInstructorPendingRequests(instructorId: string) {
    return this.prisma.lessonRequest.findMany({
      where: {
        lessonSlot: { instructorId },
        status: LessonRequestStatus.PENDING,
      },
      include: { student: true, lessonSlot: true },
    });
  }

  getStudentRequests(studentId: string, upcoming: boolean) {
    return this.prisma.lessonRequest.findMany({
      where: {
        studentId,
        status: LessonRequestStatus.APPROVED,
        lessonSlot: {
          startAt: upcoming ? { gte: new Date() } : { lte: new Date() },
        },
      },
      include: { lessonSlot: true },
    });
  }
}
