import { queryOptions } from '@tanstack/react-query';

import { auth } from './auth';

export const authQueries = {
  baseKey: 'auth',
  auth: (initData: string) =>
    queryOptions({
      queryKey: [authQueries.baseKey],
      queryFn: () => auth(initData),
    }),
};
