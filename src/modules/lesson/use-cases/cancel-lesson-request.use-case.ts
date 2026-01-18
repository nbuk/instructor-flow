import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class CancelLessonRequestUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, slotId: string, requestId: string) {
    const lessonSlot = await this.lessonSlotRepository.findById(slotId);
    if (!lessonSlot) {
      throw new NotFoundException('Lesson not found', { slotId });
    }
    const allowed = await this.policy.canInstructorManage(actorId, lessonSlot);
    if (!allowed) {
      throw new ForbiddenException(
        'Only the owner instructor can cancel request',
      );
    }
    lessonSlot.cancelRequest(requestId);
    await this.lessonSlotRepository.save(lessonSlot);
  }
}
