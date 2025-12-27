/**
 * react-calendarを使った実装
 * 他のカレンダーライブラリに交換する場合は、このファイルを差し替える
 */

import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.scss';
import type { CalendarProps } from './types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calendar = ({
  onDateSelect,
  value,
  onActiveStartDateChange,
  view = 'month',
}: CalendarProps) => {
  const handleChange = (newValue: Value) => {
    if (newValue instanceof Date) {
      onDateSelect(newValue);
    }
  };

  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate && onActiveStartDateChange) {
      onActiveStartDateChange(activeStartDate);
    }
  };

  return (
    <ReactCalendar
      className={styles.container}
      locale={'ja-JP'}
      onClickDay={view === 'month' ? handleChange : undefined}
      onClickMonth={view === 'year' ? handleChange : undefined}
      formatDay={(_locale, day) => day.getDate().toString()}
      value={value}
      onActiveStartDateChange={handleActiveStartDateChange}
      view={view}
      maxDetail={view === 'year' ? 'year' : 'month'}
    />
  );
};
