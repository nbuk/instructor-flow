import { Injectable } from '@nestjs/common';

import { LessonRequestStatus } from '../domain/entities/lesson/types';
import {
  LessonUserReaderPort,
  StudentUserInfo,
} from '../domain/ports/lesson-user-reader.port';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class GetInstructorScheduleUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly userReaderPort: LessonUserReaderPort,
  ) {}

  async execute(instructorId: string, date: Date) {
    const lessons = await this.lessonSlotRepository.findInstructorLessonsByDate(
      instructorId,
      date,
    );

    return Promise.all(
      lessons.map(async (entity) => {
        const lesson = entity.serialize();
        const approvedRequest = lesson.requests.find(
          (req) => req.status === LessonRequestStatus.APPROVED,
        );
        let student: StudentUserInfo | null = null;
        if (approvedRequest) {
          student = await this.userReaderPort.getUserInfoByStudentId(
            approvedRequest.studentId,
          );
        }
        return {
          ...lesson,
          request: {
            ...approvedRequest,
            student: student?.profile,
          },
        };
      }),
    );
  }
}
