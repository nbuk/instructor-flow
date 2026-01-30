import { z } from 'zod';

export const scheduleByTemplateSchema = z.object({
  templateId: z.uuidv7(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});
