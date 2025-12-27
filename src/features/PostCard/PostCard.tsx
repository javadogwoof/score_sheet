import dayjs from 'dayjs';
import { memo } from 'react';
import { IoPlay } from 'react-icons/io5';
import { Card } from '@/components/Card';
import styles from './PostCard.module.scss';

interface PostCardProps {
  postId: string;
  postContent: string;
  postCreatedAt: number;
  videoTitle?: string;
  onVideoClick?: () => void;
}

export const PostCard = memo(
  ({
    postContent,
    postCreatedAt,
    videoTitle,
    onVideoClick,
  }: PostCardProps) => {
    const formattedDate = dayjs(postCreatedAt).format('YYYY-MM-DD HH:mm');

    return (
      <Card className={styles.container}>
        {videoTitle && onVideoClick && (
          <button
            type="button"
            className={styles.videoInfo}
            onClick={onVideoClick}
          >
            <IoPlay className={styles.videoIcon} />
            <span className={styles.videoTitle}>{videoTitle}</span>
          </button>
        )}
        <div className={styles.postContent}>
          <p className={styles.timestamp}>投稿日時: {formattedDate}</p>
          <p className={styles.content}>{postContent}</p>
        </div>
      </Card>
    );
  },
);

PostCard.displayName = 'PostCard';
