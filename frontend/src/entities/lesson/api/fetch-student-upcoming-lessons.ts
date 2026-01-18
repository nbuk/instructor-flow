import { api } from '@/shared/api/axios';

import type { Lesson } from '../model/types';

export const fetchStudentUpcomingLessons = async (studentId: string) => {
  const response = await api.get<Lesson[]>(`/schedule/students/${studentId}`, {
    params: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  });
  return response.data;
};
