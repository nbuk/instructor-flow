import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { UserRole } from '@/modules/user/domain/entities/user';

import { LessonUserReaderPort } from '../domain/ports/lesson-user-reader.port';
import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class LessonRequestUseCase {
  constructor(
    private readonly userReaderPort: LessonUserReaderPort,
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, slotId: string) {
    const lessonSlot = await this.lessonSlotRepository.findById(slotId);
    if (!lessonSlot) {
      throw new NotFoundException('Lesson slot not found');
    }
    const allowed = await this.policy.canStudentRequestLesson(
      actorId,
      lessonSlot,
    );
    if (!allowed) {
      throw new ForbiddenException(
        'Student is not allowed to request this instructor',
      );
    }
    const user = await this.userReaderPort.getUserInfo(actorId);
    if (user?.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can request lesson');
    }
    lessonSlot.bookStudent(user.profile.id);
    await this.lessonSlotRepository.save(lessonSlot);
  }
}
