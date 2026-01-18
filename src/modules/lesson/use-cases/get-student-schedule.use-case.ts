import { Injectable } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class GetStudentScheduleUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, instructorId: string, date: Date) {
    const allowed = await this.policy.canGetInstructorLessons(
      actorId,
      instructorId,
    );
    if (!allowed) {
      throw new ForbiddenException('Only instructors can get their lessons');
    }
    const lessons = await this.lessonSlotRepository.findInstructorLessonsByDate(
      instructorId,
      date,
    );

    return lessons.map((entity) => entity.serialize());
  }
}
