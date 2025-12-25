import { memo, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { Card } from '@/components/Card/Card';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import { useAddPostMutation } from '@/hooks/queries/useAddPostMutation';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';
import type { Video } from '@/lib/domain/types';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  id: string;
  videoId: string;
  initialData: Video;
}

export const VideoCard = memo(
  ({ id, videoId, initialData }: VideoCardProps) => {
    const { data: video } = useVideoQuery(id, initialData);
    const addPostMutation = useAddPostMutation(id);

    const [newPostContent, setNewPostContent] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPostContent(e.target.value);
    };

    const handleSubmit = () => {
      if (newPostContent.trim()) {
        addPostMutation.mutate({
          videoId: id,
          content: newPostContent,
        });
        setNewPostContent('');
      }
    };

    if (!video) return null;

    const posts = video.posts;

    return (
      <Card>
        <div className={styles.container}>
          <YouTubePlayer videoId={videoId} />

          {/* 新規投稿入力 */}
          <div className={styles.inputSection}>
            <input
              className={styles.memo}
              type="text"
              value={newPostContent}
              onChange={handleChange}
              placeholder="新しい投稿を入力..."
            />
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!newPostContent.trim()}
              aria-label="投稿を追加"
            >
              <IoSend />
            </button>
          </div>

          {/* 過去の投稿一覧 */}
          {[...posts].reverse().map((post) => (
            <div key={post.id} className={styles.postItem}>
              <p className={styles.postContent}>{post.content}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // idとvideoIdが同じなら再レンダリングしない
    // initialDataは初期データなので変更を無視
    return (
      prevProps.id === nextProps.id && prevProps.videoId === nextProps.videoId
    );
  },
);
