import './Calendar.scss';

import { type FC } from 'react';
import { Calendar as RCalendar, type CalendarProps } from 'react-calendar';

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calendar: FC<CalendarProps> = (props) => {
  return <RCalendar {...props} locale={'ru-RU'} />;
};
