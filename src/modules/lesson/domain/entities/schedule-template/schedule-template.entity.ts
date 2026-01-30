import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';
import { ArgumentInvalidException } from '@/libs/exceptions/exceptions';

import { ScheduleTemplateDayRuleEntity } from './schedule-template-day-rule.entity';
import {
  DefaultTemplateRules,
  IScheduleTemplate,
  IScheduleTemplateDayRule,
} from './types';

export class ScheduleTemplateEntity extends AggregateRoot<IScheduleTemplate> {
  private readonly instructorId: string;
  private title: string;
  private defaultRules: DefaultTemplateRules;
  private readonly timezone: string;
  private readonly rules: ScheduleTemplateDayRuleEntity[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(template: IScheduleTemplate) {
    super(template.id);
    this.instructorId = template.instructorId;
    this.title = template.title;
    this.defaultRules = template.defaultRules;
    this.timezone = template.timezone;
    this.rules = template.rules.map((r) =>
      ScheduleTemplateDayRuleEntity.restore(r),
    );
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    template: Omit<
      IScheduleTemplate,
      'id' | 'rules' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const id = uuidv7();
    const createdAt = new Date();
    return new ScheduleTemplateEntity({
      id,
      createdAt,
      updatedAt: createdAt,
      rules: [],
      ...template,
    });
  }

  static restore(template: IScheduleTemplate) {
    return new ScheduleTemplateEntity(template);
  }

  public setTitle(title: string) {
    if (!title) throw new ArgumentInvalidException('title required');
    this.title = title;
    this.updatedAt = new Date();
    return this;
  }

  public setDefaultRules(defaultRules: DefaultTemplateRules) {
    this.defaultRules = defaultRules;
    this.updatedAt = new Date();
    return this;
  }

  public addRule(rule: Omit<IScheduleTemplateDayRule, 'id'>) {
    const ruleEntity = ScheduleTemplateDayRuleEntity.create(rule);
    this.rules.push(ruleEntity);
    this.updatedAt = new Date();
    return this;
  }

  public resetRules() {
    this.rules.length = 0;
    return this;
  }

  public getInstructorId() {
    return this.instructorId;
  }

  serialize(): IScheduleTemplate {
    return {
      id: this.id,
      instructorId: this.instructorId,
      title: this.title,
      defaultRules: this.defaultRules,
      timezone: this.timezone,
      rules: this.rules.map((r) => r.serialize()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
