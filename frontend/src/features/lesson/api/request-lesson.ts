import { api } from '@/shared/api/axios';

export const requestLesson = async (slotId: string) => {
  await api.post(`/schedule/${slotId}/request`);
};
