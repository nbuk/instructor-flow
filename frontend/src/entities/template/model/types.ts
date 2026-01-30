export interface ScheduleTemplate {
  id: string;
  title: string;
  instructorId: string;
  timezone: string;
  defaultRules: TemplateDefaultRules;
  rules: ScheduleTemplateRule[];
}

export type TemplateDefaultRules = Omit<ScheduleTemplateRule, 'id' | 'weekday'>;

export interface ScheduleTemplateRule {
  id: string;
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breaks: ScheduleTemplateRuleBreak[];
  slotDurationMinutes: number;
  slotGapMinutes: number;
}

export interface ScheduleTemplateRuleBreak {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}
