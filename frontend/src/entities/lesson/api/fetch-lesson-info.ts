import type { Lesson } from '@/entities/lesson';
import { api } from '@/shared/api/axios';

export const fetchLessonInfo = async (lessonId?: string) => {
  if (!lessonId) return;
  const response = await api.get<Lesson>(`/schedule/${lessonId}`);
  return response.data;
};
