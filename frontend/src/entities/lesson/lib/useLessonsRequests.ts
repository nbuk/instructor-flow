import { useQuery } from '@tanstack/react-query';

import { lessonQueries } from '../api/lesson.queries';

export const useLessonsRequests = (instructorId: string, enabled?: boolean) => {
  const { data, isLoading } = useQuery(
    lessonQueries.fetchRequests(instructorId, enabled),
  );
  return { data, isLoading };
};
