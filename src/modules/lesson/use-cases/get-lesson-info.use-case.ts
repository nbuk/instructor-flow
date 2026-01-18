import { Injectable } from '@nestjs/common';

import { NotFoundException } from '@/libs/exceptions/exceptions';
import { StudentUserInfo } from '@/modules/lesson/domain/ports/lesson-user-reader.port';

import { LessonRequestStatus } from '../domain/entities/lesson/types';
import { LessonUserReaderPort } from '../domain/ports/lesson-user-reader.port';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class GetLessonInfoUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly userReaderPort: LessonUserReaderPort,
  ) {}

  async execute(actorUserId: string, slotId: string) {
    const lesson = await this.lessonSlotRepository.findById(slotId);
    if (!lesson) throw new NotFoundException('Lesson not found', { slotId });
    const approvedRequest = lesson
      .getRequests()
      .find((req) => req.status === LessonRequestStatus.APPROVED);

    let student: StudentUserInfo | null = null;

    if (approvedRequest) {
      student = await this.userReaderPort.getUserInfoByStudentId(
        approvedRequest.studentId,
      );
    }

    return {
      ...lesson.serialize(),
      request: approvedRequest
        ? {
            ...approvedRequest,
            student: student?.profile,
          }
        : null,
    };
  }
}
