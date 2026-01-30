import {
  Multiselect as UIMultiselect,
  type MultiselectProps,
} from '@telegram-apps/telegram-ui';
import { type FC } from 'react';

import { cn } from '@/shared/lib/class-names';

export const Multiselect: FC<MultiselectProps> = (props) => {
  return (
    <UIMultiselect
      className={cn('!bg-transparent', props.className)}
      {...props}
    />
  );
};
