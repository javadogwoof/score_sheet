import { useParams } from 'react-router-dom';
import { VideoWithMemo } from '@/components/VideoWithMemo';
import type { Memo, YoutubeVideoIdDTO } from '@/lib/storage';
import styles from './RetrospectivePage.module.scss';

const RetrospectivePage = () => {
  const { date } = useParams<{ date: string }>();
  const memo: Memo = { content: '', date: date || '' };
  const video: YoutubeVideoIdDTO = { source: 'FO6P4FoLRPU' };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton}>
          ← カレンダーに戻る
        </button>
        <h2 className={styles.date}>{date}</h2>
      </div>

      <VideoWithMemo video={video} memo={memo} />
      <button type="button" className={styles.addVideoButton}>
        ＋ 動画を追加
      </button>
    </div>
  );
};

export default RetrospectivePage;
