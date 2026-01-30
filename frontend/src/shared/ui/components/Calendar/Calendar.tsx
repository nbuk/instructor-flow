import './Calendar.scss';

import { type FC, type MouseEvent } from 'react';
import { Calendar as RCalendar, type CalendarProps } from 'react-calendar';

import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import type { CalendarDateValue } from './types';

export const Calendar: FC<CalendarProps> = (props) => {
  const { onChange } = props;
  const haptic = useHapticFeedback();

  const handleChange = (
    value: CalendarDateValue,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    haptic.selectionChanged();
    onChange?.(value, e);
  };

  return <RCalendar {...props} onChange={handleChange} locale={'ru-RU'} />;
};
