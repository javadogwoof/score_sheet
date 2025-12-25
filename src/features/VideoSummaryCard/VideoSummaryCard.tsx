import { memo } from 'react';
import { Card } from '@/components/Card/Card';
import styles from './VideoSummaryCard.module.scss';

interface VideoSummaryCardProps {
  videoId: string;
  title: string;
  onClick: () => void;
}

export const VideoSummaryCard = memo(
  ({ videoId, title, onClick }: VideoSummaryCardProps) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    // DBのタイトルをそのまま表示（YouTube API呼び出し不要）
    const displayTitle = title !== '' ? title : videoId;

    return (
      <Card onClick={onClick} className={styles.container}>
        <div className={styles.content}>
          <img
            src={thumbnailUrl}
            alt={displayTitle}
            className={styles.thumbnail}
          />
          <div className={styles.info}>
            <p className={styles.videoId}>{displayTitle}</p>
          </div>
        </div>
      </Card>
    );
  },
);
