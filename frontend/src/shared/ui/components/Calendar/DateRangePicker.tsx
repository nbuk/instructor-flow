import './Calendar.scss';

import ReactDateRangePicker, {
  type DateRangePickerProps,
} from '@wojtekmaj/react-daterange-picker';
import { type FC } from 'react';

export const DateRangePicker: FC<DateRangePickerProps> = (props) => {
  return (
    <ReactDateRangePicker
      {...props}
      format={'dd.MM.yyyy'}
      rangeDivider={'до'}
      locale={'ru-RU'}
      // calendarIcon={<CalendarIcon />}
      // clearIcon={<CancelIcon />}
      calendarIcon={null}
      clearIcon={null}
    />
  );
};
