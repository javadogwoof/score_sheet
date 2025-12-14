import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/Calendar';
import { formatDate } from '@/lib/date';
import styles from './CalendarPage.module.scss';

const CalendarPage = () => {
  const [value, setValue] = useState<Date>(new Date());
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    setValue(date);
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/retrospective/${dateStr}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ふりかえりカレンダー</h1>
      <div className={styles.calendarWrapper}>
        <Calendar
          onDateSelect={handleDateSelect}
          value={value}
          locale="ja-JP"
          className={styles.calendar}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
