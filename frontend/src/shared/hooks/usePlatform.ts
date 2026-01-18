import { useLaunchParams } from '@tma.js/sdk-react';

export const usePlatform = () => {
  const lp = useLaunchParams();

  return {
    ios: ['macos', 'ios'].includes(lp.tgWebAppPlatform),
    base: !['macos', 'ios'].includes(lp.tgWebAppPlatform),
    platform: lp.tgWebAppPlatform,
  };
};
