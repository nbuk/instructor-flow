import dayjs from 'dayjs';

import { api } from '@/shared/api/axios';

import type { Lesson } from '../model/types';

export interface FetchLessonsScheduleParams {
  instructorId: string;
  date: Date;
}

export const fetchLessonsSchedule = async (
  params: FetchLessonsScheduleParams,
) => {
  const response = await api.get<Lesson[]>(
    `/schedule/instructors/${params.instructorId}`,
    {
      params: { date: dayjs(params.date).format() },
    },
  );
  return response.data;
};
