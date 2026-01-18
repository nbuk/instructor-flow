import { useQuery } from '@tanstack/react-query';

import type { FetchLessonsScheduleParams } from '../api/fetch-lessons-schedule';
import { lessonQueries } from '../api/lesson.queries';

export const useLessons = (params: FetchLessonsScheduleParams) => {
  const { data, isLoading } = useQuery(
    lessonQueries.fetchLessonsScheduleByDate(params),
  );
  const lessons = data?.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  return { data: lessons, isLoading };
};
