import { useQuery } from '@tanstack/react-query';

import type { InstructorStudentsParams } from '../api/fetch-instructor-students';
import { instructorQueries } from '../api/instructor.queries';

export const useInstructorStudents = (params: InstructorStudentsParams) => {
  const { data, isLoading } = useQuery(
    instructorQueries.fetchInstructorStudents(params),
  );
  return { data, isLoading };
};
