import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/Calendar';
import { useVideoUrlModal } from '@/contexts/VideoUrlModalContext';
import { useAddVideoToDate } from '@/hooks/useAddVideoToDate';
import { formatDate } from '@/lib/date';
import styles from './CalendarPage.module.scss';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { openModal } = useVideoUrlModal();
  const addVideoToDate = useAddVideoToDate();

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/retrospective/${dateStr}`);
  };

  const handleStartTodayRetrospective = () => {
    openModal(async (videoId: string) => {
      const today = formatDate(new Date(), 'YYYY-MM-DD');

      try {
        await addVideoToDate(today, videoId, { shouldNavigate: true });
      } catch (error) {
        console.error('Failed to save video:', error);
        alert('動画の保存に失敗しました');
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ふりかえりカレンダー</h1>

      <button className={styles.todayButton} onClick={handleStartTodayRetrospective}>
        📹 今日のふりかえりをする
      </button>

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
