import dayjs from 'dayjs';
import { memo } from 'react';
import { Card } from '@/components/Card';
import styles from './MonthlyPostItem.module.scss';

interface MonthlyPostItemProps {
  postId: string;
  postContent: string;
  postCreatedAt: number;
  videoTitle: string;
  videoDate: string;
  onVideoClick: () => void;
}

export const MonthlyPostItem = memo(
  ({
    postContent,
    postCreatedAt,
    videoTitle,
    videoDate,
    onVideoClick,
  }: MonthlyPostItemProps) => {
    const formattedDate = dayjs(postCreatedAt).format('YYYY-MM-DD HH:mm');

    return (
      <Card className={styles.container}>
        <button
          type="button"
          className={styles.videoInfo}
          onClick={onVideoClick}
        >
          <p className={styles.videoTitle}>{videoTitle || 'YouTube動画'}</p>
          <p className={styles.date}>{videoDate}</p>
        </button>
        <div className={styles.postContent}>
          <p className={styles.timestamp}>投稿日時: {formattedDate}</p>
          <p className={styles.content}>{postContent}</p>
        </div>
      </Card>
    );
  },
);

MonthlyPostItem.displayName = 'MonthlyPostItem';
