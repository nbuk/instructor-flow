import { useQuery } from '@tanstack/react-query';

import { lessonQueries } from '../api/lesson.queries';

export const useLessonInfo = (lessonId?: string) => {
  const { data, isLoading } = useQuery(lessonQueries.fetchLesson(lessonId));
  return { data, isLoading };
};
