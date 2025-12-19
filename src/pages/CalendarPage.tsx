import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/Calendar';
import { VideoUrlModal } from '@/components/VideoUrlModal';
import { formatDate } from '@/lib/date';
import { storage } from '@/lib/storage';
import styles from './CalendarPage.module.scss';

const CalendarPage = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    setValue(date);
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/retrospective/${dateStr}`);
  };

  const handleStartTodayRetrospective = () => {
    setIsModalOpen(true);
  };

  const handleVideoUrlSubmit = async (videoId: string) => {
    const today = formatDate(new Date(), 'YYYY-MM-DD');

    try {
      // 動画を保存
      const savedVideoId = await storage.saveVideo({
        type: 'youtube',
        source: videoId,
      });

      // ふりかえりに動画を紐付け
      const retrospective = await storage.getRetrospective(today);
      const videos = retrospective?.videos || [];
      const memos = retrospective?.memos || [];

      // 動画がまだ追加されていない場合のみ追加
      if (!videos.find((v) => v.id === savedVideoId)) {
        videos.push({
          id: savedVideoId,
          type: 'youtube',
          source: videoId,
        });
      }

      await storage.saveRetrospective({
        date: today,
        videos,
        memos,
      });

      // 今日の振り返りページに遷移
      navigate(`/retrospective/${today}`);
    } catch (error) {
      console.error('Failed to save video:', error);
      alert('動画の保存に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ふりかえりカレンダー</h1>

      <button className={styles.todayButton} onClick={handleStartTodayRetrospective}>
        📹 今日のふりかえりをする
      </button>

      <div className={styles.calendarWrapper}>
        <Calendar
          onDateSelect={handleDateSelect}
          value={value}
          locale="ja-JP"
          className={styles.calendar}
        />
      </div>

      <VideoUrlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVideoUrlSubmit}
      />
    </div>
  );
};

export default CalendarPage;
