/**
 * react-calendarを使った実装
 * 他のカレンダーライブラリに交換する場合は、このファイルを差し替える
 */

import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { CalendarProps } from './types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const ReactCalendarImpl = ({
  value,
  onDateSelect,
  className,
  locale = 'ja-JP',
}: CalendarProps) => {
  const handleChange = (newValue: Value) => {
    if (newValue instanceof Date) {
      onDateSelect(newValue);
    }
  };

  // 曜日に応じてクラス名を付与
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const day = date.getDay();
    if (day === 0) return 'sunday'; // 日曜日
    if (day === 6) return 'saturday'; // 土曜日
    return null;
  };

  return (
    <ReactCalendar
      onChange={handleChange}
      value={value}
      locale={locale}
      className={className}
      tileClassName={getTileClassName}
    />
  );
};
