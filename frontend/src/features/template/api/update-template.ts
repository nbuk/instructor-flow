import type { TemplateFormSchema } from '@/features/template';
import { api } from '@/shared/api/axios';

export interface UpdateTemplateParams extends TemplateFormSchema {
  templateId: string;
  instructorId: string;
}

export const updateTemplate = async (params: UpdateTemplateParams) => {
  await api.patch(`/instructors/${params.instructorId}/templates/${params.templateId}`, params)
}