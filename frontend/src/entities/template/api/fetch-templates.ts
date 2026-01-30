import { api } from '@/shared/api/axios';

import type { ScheduleTemplate } from '../model/types';

export const fetchTemplates = async (instructorId: string) => {
  const response = await api.get<ScheduleTemplate[]>(
    `instructors/${instructorId}/templates`,
  );
  return response.data;
};
