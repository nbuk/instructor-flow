export interface IScheduleTemplate {
  id: string;
  instructorId: string;
  title: string;
  type: ScheduleTemplateType;
  rules: IScheduleTemplateRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleTemplateRule {
  id: string;
  templateId: string | null;
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
  breaks: BreakTime[];
  createdAt: Date;
  updatedAt: Date;
}

export const ScheduleTemplateType = {
  DAY: 'DAY',
  WEEK: 'WEEK',
} as const;

export type ScheduleTemplateType =
  (typeof ScheduleTemplateType)[keyof typeof ScheduleTemplateType];

export type BreakTime = {
  startTime: Date;
  endTime: Date;
};
