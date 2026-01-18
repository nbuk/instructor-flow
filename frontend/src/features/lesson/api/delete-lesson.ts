import { api } from '@/shared/api/axios';

export const deleteLesson = async (lessonId: string) => {
  await api.delete(`/schedule/${lessonId}`);
};
