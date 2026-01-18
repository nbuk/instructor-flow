import { api } from '@/shared/api/axios';

import { type Account, UserRole } from '../model/types';

export const fetchAccount = async <T extends UserRole>() => {
  const response = await api.get<Account<T>>('/users/me');
  return response.data;
};
