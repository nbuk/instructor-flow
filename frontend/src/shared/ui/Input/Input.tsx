import {
  Input as UIInput,
  type InputProps as UIInputProps,
} from '@telegram-apps/telegram-ui';
import { type FC, type RefObject } from 'react';
import type { RefCallBack } from 'react-hook-form';

import styles from './Input.module.scss';

interface InputProps extends UIInputProps {
  ref?: RefObject<HTMLInputElement> | RefCallBack;
}

export const Input: FC<InputProps> = (props) => {
  return <UIInput className={styles.input} {...props} />;
};
