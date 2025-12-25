import { memo } from 'react';
import { Card } from '@/components/Card/Card';
import { useYouTubeTitleQuery } from '@/hooks/queries/useYouTubeTitleQuery';
import styles from './VideoSummaryCard.module.scss';

interface VideoSummaryCardProps {
  videoId: string;
  onClick: () => void;
}

export const VideoSummaryCard = memo(
  ({ videoId, onClick }: VideoSummaryCardProps) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const { data: title, isLoading } = useYouTubeTitleQuery(videoId);

    return (
      <Card onClick={onClick} className={styles.container}>
        <div className={styles.content}>
          <img
            src={thumbnailUrl}
            alt={title || `YouTube video ${videoId}`}
            className={styles.thumbnail}
          />
          <div className={styles.info}>
            <p className={styles.videoId}>
              {isLoading ? '読み込み中...' : title || videoId}
            </p>
          </div>
        </div>
      </Card>
    );
  },
);
