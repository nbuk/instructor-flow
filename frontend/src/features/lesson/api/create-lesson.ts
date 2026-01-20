import dayjs from 'dayjs';

import { api } from '@/shared/api/axios';

export interface CreateLessonParams {
  instructorId: string;
  startTime: Date;
  endTime: Date;
}

export const createLesson = async (params: CreateLessonParams) => {
  await api.post(`/schedule/${params.instructorId}`, {
    startTime: dayjs(params.startTime).format(),
    endTime: dayjs(params.endTime).format(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
