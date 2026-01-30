import {
  Select as UISelect,
  type SelectProps,
} from '@telegram-apps/telegram-ui';
import { type FC } from 'react';

export const Select: FC<SelectProps> = (props) => {
  return <UISelect className={'!bg-transparent'} {...props} />;
};
