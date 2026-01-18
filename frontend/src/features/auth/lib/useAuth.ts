import { useQuery } from '@tanstack/react-query';
import { useRawInitData } from '@tma.js/sdk-react';

import { authQueries } from '../api/auth.queries';

export const useAuth = () => {
  const rawInitData = useRawInitData();
  const { data, isLoading } = useQuery(authQueries.auth(rawInitData ?? ''));
  return { isAuth: !!data, isLoading };
};
