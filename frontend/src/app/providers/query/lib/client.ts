import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import LogRocket from 'logrocket';

import type { Account } from '@/entities/account';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 2,
      placeholderData: keepPreviousData,
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event.type !== 'updated') return;

  const query = event.query;
  const data: Account = query.state.data;

  if (!query.meta?.identifyUser || !data) return;

  LogRocket.identify(data.id, {
    role: data.role,
    name: `${data.profile.firstName} ${data.profile.lastName}`,
  });
});
