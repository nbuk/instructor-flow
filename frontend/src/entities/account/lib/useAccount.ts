import { useQuery } from '@tanstack/react-query';

import { accountQueries } from '../api/account.queries';
import { UserRole } from '../model/types';

export const useAccount = <T extends UserRole>() => {
  const { data, isLoading } = useQuery(accountQueries.fetchAccount<T>());
  return { data, isLoading };
};
