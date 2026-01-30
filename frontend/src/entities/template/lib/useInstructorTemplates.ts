import { useQuery } from '@tanstack/react-query';

import { templateQueries } from '../api/template.queries';

export const useInstructorTemplates = (instructorId: string) => {
  const { data, isLoading } = useQuery(
    templateQueries.fetchTemplates(instructorId),
  );
  return { data, isLoading };
};
