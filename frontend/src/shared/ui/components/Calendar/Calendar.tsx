import './Calendar.scss';

import { type FC, type MouseEvent } from 'react';
import { Calendar as RCalendar, type CalendarProps } from 'react-calendar';

import { useHapticFeedback } from '../../../hooks/useHapticFeedback';

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calendar: FC<CalendarProps> = (props) => {
  const { onChange } = props;
  const haptic = useHapticFeedback();

  const handleChange = (value: Value, e: MouseEvent<HTMLButtonElement>) => {
    haptic.selectionChanged();
    onChange?.(value, e);
  };

  return <RCalendar {...props} onChange={handleChange} locale={'ru-RU'} />;
};
