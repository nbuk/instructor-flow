import { api } from '@/shared/api/axios';

import type { StudentProfileSchema } from '../model/student-profile.schema';

export interface UpdateStudentProfileParams extends StudentProfileSchema {
  studentId: string;
}

export const updateStudentProfile = async (
  params: UpdateStudentProfileParams,
) => {
  await api.patch(`/students/${params.studentId}`, params);
};
