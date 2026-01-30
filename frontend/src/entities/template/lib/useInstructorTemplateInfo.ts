import { useQuery } from '@tanstack/react-query';

import type { FetchTemplateInfoParams } from '../api/fetch-template-info';
import { templateQueries } from '../api/template.queries';

export const useInstructorTemplateInfo = (params: FetchTemplateInfoParams) => {
  const { data, isLoading } = useQuery(
    templateQueries.fetchTemplateInfo(params),
  );
  return { data, isLoading };
};
