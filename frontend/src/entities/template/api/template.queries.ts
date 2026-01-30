import { queryOptions } from '@tanstack/react-query';

import {
  fetchTemplateInfo,
  type FetchTemplateInfoParams,
} from './fetch-template-info';
import { fetchTemplates } from './fetch-templates';

export const templateQueries = {
  baseKey: 'templates',
  fetchTemplates: (instructorId: string) =>
    queryOptions({
      queryKey: [templateQueries.baseKey, 'list'],
      queryFn: () => fetchTemplates(instructorId),
    }),
  fetchTemplateInfo: (params: FetchTemplateInfoParams) =>
    queryOptions({
      queryFn: () => fetchTemplateInfo(params),
      queryKey: [templateQueries.baseKey, 'info', params.templateId],
    }),
};
