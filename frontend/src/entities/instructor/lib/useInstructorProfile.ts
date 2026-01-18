import { useQuery } from '@tanstack/react-query';

import { instructorQueries } from '../api/instructor.queries';

export const useInstructorProfile = (instructorId?: string) => {
  const { data, isLoading } = useQuery(
    instructorQueries.fetchInstructorProfile(instructorId),
  );
  return { data, isLoading };
};
