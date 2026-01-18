import { api } from '@/shared/api/axios';

import type { PendingLessonRequest } from '../model/types';

export const fetchLessonRequests = async (instructorId: string) => {
  const response = await api.get<PendingLessonRequest[]>(
    `/schedule/${instructorId}/requests`,
  );
  return response.data;
};
