import { Injectable, NotFoundException } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { ScheduleTemplateRepository } from '../repositories/schedule-template.repository';

@Injectable()
export class GetInstructorTemplateInfoUseCase {
  constructor(
    private readonly templateRepository: ScheduleTemplateRepository,
    private readonly access: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, templateId: string) {
    const template = await this.templateRepository.findById(templateId);
    if (!template) throw new NotFoundException(`template not found`);
    const allowed = await this.access.canGetTemplateInfo(actorId, template);
    if (!allowed) throw new ForbiddenException('forbidden');
    return template?.serialize();
  }
}
