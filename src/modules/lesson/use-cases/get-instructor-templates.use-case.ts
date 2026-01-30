import { Injectable } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { ScheduleTemplateRepository } from '../repositories/schedule-template.repository';

@Injectable()
export class GetInstructorTemplatesUseCase {
  constructor(
    private readonly templatesRepository: ScheduleTemplateRepository,
    private readonly access: LessonAccessPolicy,
  ) {}

  async execute(actorUserId: string, instructorId: string) {
    const allowed = await this.access.canGetInstructorTemplates(
      actorUserId,
      instructorId,
    );
    if (!allowed) throw new ForbiddenException('forbidden');
    return this.templatesRepository.findAllByInstructorId(instructorId);
  }
}
