/**
 * react-calendarを使った実装
 * 他のカレンダーライブラリに交換する場合は、このファイルを差し替える
 */

import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import type { CalendarProps } from './types';
import styles from './Calendar.module.scss';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calendar = ({
  onDateSelect,
}: CalendarProps) => {
  const handleChange = (newValue: Value) => {
    if (newValue instanceof Date) {
      onDateSelect(newValue);
    }
  };

  return (
    <ReactCalendar
      className={styles.container}
      locale={'ja-JP'}
      onClickDay={handleChange}
      formatDay={(_locale, day) => day.getDate().toString()}
    />
  );
};
