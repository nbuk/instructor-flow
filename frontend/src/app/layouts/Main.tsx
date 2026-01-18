import { FixedLayout } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

import { TabBar } from '@/widgets/TabBar/ui/TabBar';

export const MainLayout: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tabBarHeight, setTabBarHeight] = useState(0);

  useEffect(() => {
    const timeoutCallback = () => {
      if (!ref.current) {
        setTimeout(timeoutCallback, 100);
        return;
      }
      setTabBarHeight(ref.current.clientHeight);
    };
    setTimeout(timeoutCallback, 500);
  });

  return (
    <>
      <div
        style={{
          paddingBottom: `calc(var(--tg-viewport-content-safe-area-inset-bottom) + var(--tg-viewport-safe-area-inset-bottom) + ${tabBarHeight}px)`,
        }}
        className={'flex flex-col min-h-[100vh]'}
      >
        <Outlet />
      </div>
      <Toaster position={'top-center'} />
      <FixedLayout className={'z-10'} vertical={'bottom'}>
        <TabBar ref={ref} />
      </FixedLayout>
    </>
  );
};
