import { api } from '@/shared/api/axios';

export interface CreateScheduleByTemplateParams {
  templateId: string;
  startDate: Date;
  endDate: Date;
}

export const createScheduleByTemplate = async (
  params: CreateScheduleByTemplateParams,
) => {
  await api.post(`/schedule/template/${params.templateId}`, {
    ...params,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
