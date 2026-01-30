import { z } from 'zod';

import type { ScheduleTemplate } from '@/entities/template';
import { isValidTimeRange } from '@/shared/lib/is-valid-time-range';

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Неверный формат времени');

export const timeRangeSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine(
    (data) => {
      return isValidTimeRange(data.startTime, data.endTime);
    },
    {
      message: 'Начальное время должно быть меньше конечного',
      path: ['startTime'],
    },
  );

const templateRuleSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema,
    breaks: timeRangeSchema.array(),
    slotDurationMinutes: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value.length) return Number(value);
        return value;
      },
      z.number().min(1, 'Некорректная продолжительность занятия'),
    ),
    slotGapMinutes: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value.length) return Number(value);
        return value;
      },
      z.number().min(0, 'Интервал между занятиями не может быть отрицательным'),
    ),
  })
  .refine(
    (data) => {
      return isValidTimeRange(data.startTime, data.endTime);
    },
    {
      message: 'Некорректное время рабочего дня',
      path: ['startTime'],
    },
  );

export const templateFormSchema = z.object({
  title: z.string().min(1, 'Не указано имя шаблона'),
  defaultRules: templateRuleSchema.optional(),
  rules: z.array(
    templateRuleSchema.safeExtend({
      id: z.uuidv7().optional(),
      weekday: z.number().min(0).max(6),
    }),
  ),
});

export type TemplateFormSchema = z.infer<typeof templateFormSchema>;

const createRule = (weekday: number) => ({
  weekday,
  startTime: '',
  endTime: '',
  breaks: [],
  slotDurationMinutes: 90,
  slotGapMinutes: 0,
});

export const getDefaultValues = (
  template?: ScheduleTemplate,
): TemplateFormSchema => ({
  title: template?.title ?? '',
  defaultRules: template?.defaultRules ?? {
    startTime: '',
    endTime: '',
    breaks: [],
    slotDurationMinutes: 90,
    slotGapMinutes: 0,
  },
  rules: template?.rules ?? [1, 2, 3, 4, 5].map(createRule),
});
