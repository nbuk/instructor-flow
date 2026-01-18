import { api } from '@/shared/api/axios';

import type { InstructorProfile } from '../model/types';

export const fetchInstructorProfile = async (instructorId?: string) => {
  if (!instructorId) return;
  const response = await api.get<InstructorProfile>(
    `/instructors/${instructorId}`,
  );
  return response.data;
};
