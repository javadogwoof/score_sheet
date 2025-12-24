import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { Card } from '@/components/Card/Card';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import styles from './VideoCard.module.scss';

export interface Post {
  id: string;
  content: string;
}

interface VideoCardProps {
  videoId: string;
  posts: Post[];
  onAddPost: (content: string) => void;
}

export const VideoCard = ({ videoId, posts, onAddPost }: VideoCardProps) => {
  const [newPostContent, setNewPostContent] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent(e.target.value);
  };

  const handleSubmit = () => {
    if (newPostContent.trim()) {
      onAddPost(newPostContent);
      setNewPostContent('');
    }
  };

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
};
