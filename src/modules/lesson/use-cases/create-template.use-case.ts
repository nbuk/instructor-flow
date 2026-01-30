import { ForbiddenException, Injectable } from '@nestjs/common';

import { ScheduleTemplateEntity } from '../domain/entities/schedule-template/schedule-template.entity';
import {
  DefaultTemplateRules,
  IScheduleTemplateDayRule,
} from '../domain/entities/schedule-template/types';
import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { ScheduleTemplateRepository } from '../repositories/schedule-template.repository';

interface CreateTemplateParams {
  actorId: string;
  title: string;
  timezone: string;
  instructorId: string;
  defaultRules: DefaultTemplateRules;
  rules: Omit<IScheduleTemplateDayRule, 'id'>[];
}

@Injectable()
export class CreateTemplateUseCase {
  constructor(
    private readonly templateRepository: ScheduleTemplateRepository,
    private readonly access: LessonAccessPolicy,
  ) {}

  async execute(params: CreateTemplateParams): Promise<void> {
    const { actorId, title, timezone, instructorId, rules, defaultRules } =
      params;
    const allowed = await this.access.canCreateTemplate(actorId);
    if (!allowed) throw new ForbiddenException('forbidden');

    const template = ScheduleTemplateEntity.create({
      title,
      timezone,
      instructorId,
      defaultRules,
    });

    for (const rule of rules) {
      template.addRule(rule);
    }

    await this.templateRepository.save(template);
  }
}
