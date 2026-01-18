import { api } from '@/shared/api/axios';

export interface UpdateInstructorProfileParams {
  instructorId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  car: {
    model: string;
    licensePlate: string;
  };
}

export const updateInstructorProfile = async (
  params: UpdateInstructorProfileParams,
) => {
  await api.patch(`/instructors/${params.instructorId}`, params);
};
