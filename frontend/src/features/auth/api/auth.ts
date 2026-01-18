import { api } from '@/shared/api/axios';

export const auth = async (initData: string) => {
  try {
    const refresh = await api.get<{ accessToken: string }>('/auth/refresh');
    return refresh.data;
  } catch (e) {
    const response = await api.get<{ accessToken: string }>('/auth/tma', {
      headers: {
        Authorization: `tma ${initData}`,
      },
    });
    return response.data;
  }
};
