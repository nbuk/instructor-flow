import { api } from '@/shared/api/axios';

import type {
  InstructorProfileSchema,
  StudentProfileSchema,
} from '../model/update-profile.schema';

export const updateProfile = async (
  data: InstructorProfileSchema | StudentProfileSchema,
) => {
  await api.patch('/users/profile', data);
};
