import { api } from '@/shared/api/axios';

import type { TemplateFormSchema } from '../model/template-form.schema';

export interface CreateTemplateParams extends TemplateFormSchema {
  instructorId: string;
}

export const createTemplate = async (data: CreateTemplateParams) => {
  await api.post(`/instructors/${data.instructorId}/templates`, {
    ...data,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
