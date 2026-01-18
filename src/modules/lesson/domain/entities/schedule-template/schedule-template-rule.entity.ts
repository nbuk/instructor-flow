import { uuidv7 } from 'uuidv7';

import { Entity } from '@/libs/domain/entity.base';

import { TimeRange } from '../../value-objects/time-range.vo';
import { BreakTime, IScheduleTemplateRule } from './types';

export class ScheduleTemplateRule extends Entity<IScheduleTemplateRule> {
  private readonly templateId: string | null;
  private readonly dayOfWeek: number | null;
  private readonly timeRange: TimeRange;
  private readonly breaks: BreakTime[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(rule: IScheduleTemplateRule) {
    super(rule.id);
    this.templateId = rule.templateId;
    this.dayOfWeek = rule.dayOfWeek;
    this.timeRange = new TimeRange(rule.startTime, rule.endTime);
    this.breaks = rule.breaks;
    this.createdAt = rule.createdAt;
    this.updatedAt = rule.updatedAt;
  }

  static create(
    rule: Omit<IScheduleTemplateRule, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const id = uuidv7();
    const createdAt = new Date();
    return new ScheduleTemplateRule({
      ...rule,
      id,
      dayOfWeek: rule.dayOfWeek ?? null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  static restore(rule: IScheduleTemplateRule) {
    return new ScheduleTemplateRule(rule);
  }

  public serialize(): IScheduleTemplateRule {
    return {
      id: this.id,
      templateId: this.templateId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.timeRange.getValue().startTime,
      endTime: this.timeRange.getValue().endTime,
      breaks: this.breaks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
