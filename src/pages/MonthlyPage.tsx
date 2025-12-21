import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import Calendar from '@/components/Calendar';
import { formatDate } from '@/lib/date';
import styles from './MonthlyPage.module.scss';

const MonthlyPage = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/daily/${dateStr}`);
  };

  return (
    <div className={styles.container}>
      <AppHeader title="ふりかえりカレンダー" />

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

export default MonthlyPage;
