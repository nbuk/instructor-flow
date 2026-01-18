import { queryOptions } from '@tanstack/react-query';

import { UserRole } from '../model/types';
import { fetchAccount } from './fetch-account';

export const accountQueries = {
  baseKey: 'account',
  fetchAccount: <T extends UserRole>() =>
    queryOptions({
      queryKey: [accountQueries.baseKey],
      queryFn: () => fetchAccount<T>(),
    }),
};
