import { Injectable } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class GetStudentUpcomingLessonsUseCase {
  constructor(
    private readonly lessonRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, studentId: string, timezone: string) {
    const allowed = await this.policy.canGetStudentLessons(actorId, studentId);
    if (!allowed) throw new ForbiddenException('forbidden');
    return this.lessonRepository.findStudentUpcomingLessons(
      studentId,
      timezone,
    );
  }
}
