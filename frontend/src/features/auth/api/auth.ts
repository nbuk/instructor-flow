import { api } from '@/shared/api/axios';

export const auth = async (initData: string) => {
  const response = await api.get<{ accessToken: string }>('/auth/tma', {
    headers: {
      Authorization: `tma ${initData}`,
    },
  });
  return response.data;
};
