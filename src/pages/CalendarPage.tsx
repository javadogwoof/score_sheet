import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/Calendar';
import { formatDate } from '@/lib/date';
import styles from './CalendarPage.module.scss';

const CalendarPage = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/retrospective/${dateStr}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ふりかえりカレンダー</h1>

      <div className={styles.calendarWrapper}>
        <Calendar
          locale="ja-JP"
          className={styles.calendar}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
