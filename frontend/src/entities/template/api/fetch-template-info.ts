import { api } from '@/shared/api/axios';

import type { ScheduleTemplate } from '../model/types';

export interface FetchTemplateInfoParams {
  instructorId: string;
  templateId: string;
}

export const fetchTemplateInfo = async (params: FetchTemplateInfoParams) => {
  const response = await api.get<ScheduleTemplate>(
    `/instructors/${params.instructorId}/templates/${params.templateId}`,
  );
  return response.data;
};
