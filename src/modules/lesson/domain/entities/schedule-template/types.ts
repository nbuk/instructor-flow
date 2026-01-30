export interface IScheduleTemplate {
  id: string;
  instructorId: string;
  title: string;
  timezone: string;
  defaultRules: DefaultTemplateRules;
  rules: IScheduleTemplateDayRule[];
  createdAt: Date;
  updatedAt: Date;
}

export type DefaultTemplateRules = Omit<
  IScheduleTemplateDayRule,
  'id' | 'weekday'
>;

export interface IScheduleTemplateDayRule {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  breaks: TemplateRuleBreak[];
  slotDurationMinutes: number;
  slotGapMinutes: number;
}

export interface TemplateRuleBreak {
  startTime: string;
  endTime: string;
}
