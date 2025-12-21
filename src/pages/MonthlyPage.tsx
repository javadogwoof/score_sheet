import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import Calendar from '@/components/Calendar';
import { Card } from '@/components/Card/Card';
import { formatDate } from '@/lib/date';
import styles from './MonthlyPage.module.scss';

const MonthlyPage = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/daily/${dateStr}`);
  };

  return (
    <>
      <AppHeader title="ふりかえりカレンダー" />
      <AppMain>
        <Card>
          <Calendar
            locale="ja-JP"
            className={styles.calendar}
            onDateSelect={handleDateSelect}
          />
        </Card>
      </AppMain>
    </>
  );
};

export default MonthlyPage;
