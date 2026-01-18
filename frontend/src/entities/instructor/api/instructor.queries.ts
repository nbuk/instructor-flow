import { queryOptions } from '@tanstack/react-query';

import { fetchInstructorProfile } from './fetch-instructor-profile';
import {
  fetchInstructorStudents,
  type InstructorStudentsParams,
} from './fetch-instructor-students';

export const instructorQueries = {
  baseKey: 'instructor',
  fetchInstructorStudents: (params: InstructorStudentsParams) =>
    queryOptions({
      queryKey: [
        instructorQueries.baseKey,
        'students',
        params.offset,
        params.limit,
        params.orderBy,
        params.sort,
        params.search,
      ],
      queryFn: () => fetchInstructorStudents(params),
    }),
  fetchInstructorProfile: (instructorId?: string) =>
    queryOptions({
      queryKey: [instructorQueries.baseKey, instructorId],
      queryFn: () => fetchInstructorProfile(instructorId),
    }),
};
