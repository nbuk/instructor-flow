import { Caption } from '@telegram-apps/telegram-ui';
import { type FC, type ReactNode } from 'react';

import { AlertIcon } from '@/shared/ui/icons/AlertIcon';
import { InfoIcon } from '@/shared/ui/icons/InfoIcon';

type ToastType = 'error' | 'info';

const iconColorMap: Record<ToastType, string> = {
  error: 'text-[var(--tgui--destructive_text_color)]',
  info: 'text-[var(--tgui--toast_accent_color)]',
};

const iconMap: Record<ToastType, ReactNode> = {
  error: <AlertIcon />,
  info: <InfoIcon />,
};

interface ToastProps {
  type: ToastType;
  message: string;
}

export const Toast: FC<ToastProps> = (props) => {
  const { type, message } = props;

  return (
    <div
      className={
        'rounded-full bg-[var(--tg-theme-section-separator-color)] px-5 py-3 max-w-[80vw] mx-auto w-fit flex gap-2 items-center'
      }
    >
      <span className={iconColorMap[type]}>{iconMap[type]}</span>
      <Caption weight={'3'}>{message}</Caption>
    </div>
  );
};
