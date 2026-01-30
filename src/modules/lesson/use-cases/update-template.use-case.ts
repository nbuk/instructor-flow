import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import {
  DefaultTemplateRules,
  IScheduleTemplateDayRule,
} from '../domain/entities/schedule-template/types';
import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { ScheduleTemplateRepository } from '../repositories/schedule-template.repository';

interface UpdateTemplateParams {
  actorId: string;
  templateId: string;
  title: string;
  defaultRules: DefaultTemplateRules;
  rules: IScheduleTemplateDayRule[];
}

@Injectable()
export class UpdateTemplateUseCase {
  constructor(
    private readonly templateRepository: ScheduleTemplateRepository,
    private readonly access: LessonAccessPolicy,
  ) {}

  async execute(params: UpdateTemplateParams): Promise<void> {
    const { actorId, templateId, title, defaultRules, rules } = params;
    const template = await this.templateRepository.findById(templateId);
    if (!template) throw new NotFoundException('template not found');
    const allowed = await this.access.canUpdateTemplate(actorId, template);
    if (!allowed) throw new ForbiddenException('forbidden');

    template.setTitle(title).setDefaultRules(defaultRules).resetRules();

    for (const rule of rules) {
      template.addRule(rule);
    }

    await this.templateRepository.save(template);
  }
}
