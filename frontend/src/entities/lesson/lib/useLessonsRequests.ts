import { useQuery } from '@tanstack/react-query';

import { lessonQueries } from '../api/lesson.queries';

export const useLessonsRequests = (instructorId: string) => {
  const { data, isLoading } = useQuery(
    lessonQueries.fetchRequests(instructorId),
  );
  return { data, isLoading };
};
