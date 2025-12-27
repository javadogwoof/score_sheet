import { memo, useState } from 'react';
import { IoSend, IoTrash } from 'react-icons/io5';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import { useAddPostMutation } from '@/hooks/queries/useAddPostMutation';
import { useDeletePostMutation } from '@/hooks/queries/useDeletePostMutation';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  id: string;
  youtubeVideoId: string;
}

export const VideoCard = memo(
  ({ id, youtubeVideoId }: VideoCardProps) => {
    const { data: video } = useVideoQuery(id);
    const addPostMutation = useAddPostMutation(id);
    const deletePostMutation = useDeletePostMutation(id);

    const [newPostContent, setNewPostContent] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

    const handleDeletePost = (postId: string) => {
      setDeleteConfirm(postId);
    };

    const confirmDeletePost = () => {
      if (deleteConfirm) {
        deletePostMutation.mutate(deleteConfirm, {
          onSuccess: () => {
            setDeleteConfirm(null);
          },
          onError: (error) => {
            console.error('Failed to delete post:', error);
            // エラー時はダイアログを閉じてエラーを確認できるようにする
            setDeleteConfirm(null);
          },
        });
      }
    };

    if (!video) return null;

    const posts = video.posts;

    return (
      <Card>
        <div className={styles.container}>
          <YouTubePlayer videoId={youtubeVideoId} />

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
              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
                className={styles.deleteButton}
                aria-label="投稿を削除"
              >
                <IoTrash />
              </button>
            </div>
          ))}
        </div>

        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          title="投稿を削除"
          message="この投稿を削除しますか？"
          onConfirm={confirmDeletePost}
          onCancel={() => setDeleteConfirm(null)}
        />
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // idとyoutubeVideoIdが同じなら再レンダリングしない
    // initialDataは初期データなので変更を無視
    return (
      prevProps.id === nextProps.id &&
      prevProps.youtubeVideoId === nextProps.youtubeVideoId
    );
  },
);
