import { uuidv7 } from 'uuidv7';

import { Entity } from '@/libs/domain/entity.base';

import { IScheduleTemplateDayRule, TemplateRuleBreak } from './types';

export class ScheduleTemplateDayRuleEntity extends Entity<IScheduleTemplateDayRule> {
  private readonly weekday: number;
  private startTime: string;
  private endTime: string;
  private breaks: TemplateRuleBreak[];
  private slotDurationMinutes: number;
  private slotGapMinutes: number;

  private constructor(rule: IScheduleTemplateDayRule) {
    super(rule.id);
    this.weekday = rule.weekday;
    this.startTime = rule.startTime;
    this.endTime = rule.endTime;
    this.breaks = rule.breaks;
    this.slotDurationMinutes = rule.slotDurationMinutes;
    this.slotGapMinutes = rule.slotGapMinutes;
  }

  static create(rule: Omit<IScheduleTemplateDayRule, 'id'>) {
    const id = uuidv7();
    return new ScheduleTemplateDayRuleEntity({ id, ...rule });
  }

  static restore(rule: IScheduleTemplateDayRule) {
    return new ScheduleTemplateDayRuleEntity(rule);
  }

  public setStartTime(startTime: string) {
    this.startTime = startTime;
    return this;
  }

  public setEndTime(endTime: string) {
    this.endTime = endTime;
    return this;
  }

  public setBreaks(breaks: TemplateRuleBreak[]) {
    this.breaks = breaks;
    return this;
  }

  public setSlotDuration(slotDurationMinutes: number) {
    this.slotDurationMinutes = slotDurationMinutes;
    return this;
  }

  public setSlotGapMinutes(slotGapMinutes: number) {
    this.slotGapMinutes = slotGapMinutes;
    return this;
  }

  serialize(): IScheduleTemplateDayRule {
    return {
      id: this.id,
      weekday: this.weekday,
      startTime: this.startTime,
      endTime: this.endTime,
      breaks: this.breaks,
      slotDurationMinutes: this.slotDurationMinutes,
      slotGapMinutes: this.slotGapMinutes,
    };
  }
}
