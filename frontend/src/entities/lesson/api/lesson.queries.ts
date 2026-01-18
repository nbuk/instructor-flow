import { queryOptions } from '@tanstack/react-query';

import { fetchLessonInfo } from './fetch-lesson-info';
import { fetchLessonRequests } from './fetch-lesson-requests';
import {
  fetchLessonsSchedule,
  type FetchLessonsScheduleParams,
} from './fetch-lessons-schedule';
import { fetchStudentUpcomingLessons } from './fetch-student-upcoming-lessons';

export const lessonQueries = {
  baseKey: 'lessons',
  fetchLessonsScheduleByDate: (params: FetchLessonsScheduleParams) =>
    queryOptions({
      queryKey: [
        lessonQueries.baseKey,
        params.instructorId,
        params.date.toISOString(),
      ],
      queryFn: () => fetchLessonsSchedule(params),
    }),
  fetchLesson: (lessonId?: string) =>
    queryOptions({
      queryKey: [lessonQueries.baseKey, lessonId],
      queryFn: () => fetchLessonInfo(lessonId),
    }),
  fetchRequests: (instructorId: string) =>
    queryOptions({
      queryKey: [lessonQueries.baseKey, 'requests', instructorId],
      queryFn: () => fetchLessonRequests(instructorId),
    }),
  fetchStudentUpcomingLessons: (studentId: string) =>
    queryOptions({
      queryKey: [lessonQueries.baseKey, studentId],
      queryFn: () => fetchStudentUpcomingLessons(studentId),
    }),
};
