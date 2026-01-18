import { QueryClientProvider } from '@tanstack/react-query';
import { type FC, type ReactNode } from 'react';

import { queryClient } from '../lib/client';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
