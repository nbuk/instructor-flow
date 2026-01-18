import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';
import { ArgumentInvalidException } from '@/libs/exceptions/exceptions';

import { ScheduleTemplateRule } from './schedule-template-rule.entity';
import {
  IScheduleTemplate,
  IScheduleTemplateRule,
  ScheduleTemplateType,
} from './types';

export class ScheduleTemplateEntity extends AggregateRoot<IScheduleTemplate> {
  private readonly instructorId: string;
  private title: string;
  private readonly type: ScheduleTemplateType;
  private readonly rules: ScheduleTemplateRule[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(template: IScheduleTemplate) {
    super(template.id);
    this.instructorId = template.instructorId;
    this.title = template.title;
    this.createdAt = template.createdAt;
    this.updatedAt = template.updatedAt;
  }

  static create(
    template: Omit<IScheduleTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const id = uuidv7();
    const createdAt = new Date();
    return new ScheduleTemplateEntity({
      ...template,
      id,
      createdAt,
      updatedAt: createdAt,
    });
  }

  static restore(template: IScheduleTemplate): ScheduleTemplateEntity {
    return new ScheduleTemplateEntity(template);
  }

  public setTitle(title: string) {
    if (!title.length) {
      throw new ArgumentInvalidException('Title cannot be empty', {
        templateId: this.id,
      });
    }
    if (title.length > 100) {
      throw new ArgumentInvalidException(
        'Maximum title length 100 characters',
        {
          templateId: this.id,
        },
      );
    }
    this.title = title;
    this.updatedAt = new Date();
    return this;
  }

  public addRule(
    rule: Omit<
      IScheduleTemplateRule,
      'id' | 'templateId' | 'createdAt' | 'updatedAt'
    >,
  ) {
    if (rule.dayOfWeek && this.type !== ScheduleTemplateType.WEEK) {
      throw new ArgumentInvalidException(
        'Weekly schedule cannot have day of week',
        {
          templateId: this.id,
          rule,
        },
      );
    }
    this.rules.push(
      ScheduleTemplateRule.create({ templateId: this.id, ...rule }),
    );
    this.updatedAt = new Date();
    return this;
  }

  serialize(): IScheduleTemplate {
    return {
      id: this.id,
      instructorId: this.instructorId,
      title: this.title,
      type: this.type,
      rules: this.rules.map((rule) => rule.serialize()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
