import { memo } from 'react';
import { Card } from '@/components/Card';
import styles from './VideoSummaryCard.module.scss';

interface VideoSummaryCardProps {
  youtubeVideoId: string;
  title: string;
  onClick: () => void;
}

export const VideoSummaryCard = memo(
  ({ youtubeVideoId, title, onClick }: VideoSummaryCardProps) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`;

    // DBのタイトルをそのまま表示（YouTube API呼び出し不要）
    const displayTitle = title !== '' ? title : youtubeVideoId;

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
