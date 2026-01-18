import { AppRoot } from '@telegram-apps/telegram-ui';
import { miniApp, useSignal, viewport } from '@tma.js/sdk-react';
import { useEffect } from 'react';

import { QueryProvider } from './providers/query';
import { RouterProvider } from './providers/router';

export const App = () => {
  const isDark = useSignal(miniApp.isDark);

  useEffect(() => {
    miniApp.ready();
    if (!viewport.isExpanded()) {
      viewport.expand();
    }
  }, []);

  return (
    <AppRoot appearance={isDark ? 'dark' : 'light'} platform={'ios'}>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </AppRoot>
  );
};
