import { useQuery } from '@tanstack/react-query';
import LogRocket from 'logrocket';

import { accountQueries } from '../api/account.queries';
import { UserRole } from '../model/types';

export const useAccount = <T extends UserRole>() => {
  const { data, isLoading } = useQuery(accountQueries.fetchAccount<T>());
  if (data) {
    LogRocket.identify(data.id, {
      role: data.role,
      name: `${data.profile.firstName} ${data.profile.lastName}`,
    });
  }

  return { data, isLoading };
};
