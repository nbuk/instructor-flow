import { UserStatus } from '@/entities/account';
import { api } from '@/shared/api/axios';

export interface ManageStudentTrainingParams {
  studentId: string;
  status: UserStatus;
}

export const manageStudentTraining = async (
  params: ManageStudentTrainingParams,
) => {
  await api.patch(`/students/${params.studentId}/status`, {
    status: params.status,
  });
};
