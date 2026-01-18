import { AppRoot } from '@telegram-apps/telegram-ui';
import {
  miniApp,
  useLaunchParams,
  useSignal,
  viewport,
} from '@tma.js/sdk-react';
import { useEffect } from 'react';

import { QueryProvider } from './providers/query';
import { RouterProvider } from './providers/router';

export const App = () => {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  useEffect(() => {
    miniApp.ready();
    if (!viewport.isExpanded()) {
      viewport.expand();
    }
  }, []);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </AppRoot>
  );
};
