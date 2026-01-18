import {
  api,
  type PaginatedParams,
  type PaginatedResponse,
} from '@/shared/api/axios';

import type { InstructorStudentProfile } from '../model/types';

export interface InstructorStudentsParams extends PaginatedParams {
  instructorId: string;
}

export const fetchInstructorStudents = async (
  params: InstructorStudentsParams,
) => {
  const response = await api.get<PaginatedResponse<InstructorStudentProfile>>(
    `/instructors/${params.instructorId}/students`,
    { params },
  );
  return response.data;
};
