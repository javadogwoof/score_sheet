import { Card } from '@/components/Card/Card';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  videoId: string;
  memo: string;
  onMemoChange: (memo: string) => void;
}

export const VideoCard = ({ videoId, memo, onMemoChange }: VideoCardProps) => {
  return (
    <Card>
      <div className={styles.container}>
        <YouTubePlayer videoId={videoId} />
        <textarea
          className={styles.memo}
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="メモを入力..."
        />
      </div>
    </Card>
  );
};
