import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonSlotRepository } from '../repositories/lesson-slot.repository';

@Injectable()
export class DeleteLessonSlotUseCase {
  constructor(
    private readonly lessonSlotRepository: LessonSlotRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, slotId: string) {
    const slot = await this.lessonSlotRepository.findById(slotId);
    if (!slot) throw new NotFoundException('Lesson slot not found');
    const allowed = await this.policy.canInstructorManage(actorId, slot);
    if (!allowed) {
      throw new ForbiddenException(
        'Only the owner instructor can delete the slot',
      );
    }
    slot.delete();
    await this.lessonSlotRepository.delete(slot);
  }
}
