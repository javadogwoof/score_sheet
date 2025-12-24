import { Card } from '@/components/Card/Card';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  videoId: string;
  memo: string;
  hasPost: boolean;
  onMemoChange: (memo: string) => void;
}

export const VideoCard = ({
  videoId,
  memo,
  hasPost,
  onMemoChange,
}: VideoCardProps) => {
  return (
    <Card>
      <div className={styles.container}>
        <YouTubePlayer videoId={videoId} />
        <textarea
          className={styles.memo}
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder={
            hasPost ? 'メモを入力...' : '入力を開始して振り返りを追加'
          }
        />
      </div>
    </Card>
  );
};
