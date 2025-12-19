import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import type { Video, Memo } from '@/lib/storage';
import styles from './VideoWithMemo.module.scss';

interface VideoWithMemoProps {
  video: Video;
  memo?: Memo;
  onSaveMemo: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const VideoWithMemo = ({ video, memo, onSaveMemo, onDelete }: VideoWithMemoProps) => {
  const [memoContent, setMemoContent] = useState(memo?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSaveMemo(memoContent);
      alert('保存しました');
    } catch (error) {
      console.error('Failed to save memo:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('削除に失敗しました');
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        {video.type === 'youtube' && <YouTubePlayer videoId={video.source} />}
        {video.type === 'local' && (
          <div className={styles.localVideo}>
            ローカル動画: {video.title || video.source}
          </div>
        )}
      </div>

      <form className={styles.memoForm} onSubmit={handleSave}>
        <label className={styles.label} htmlFor={`memo-${video.id}`}>
          メモ
        </label>
        <textarea
          id={`memo-${video.id}`}
          className={styles.textarea}
          value={memoContent}
          onChange={(e) => setMemoContent(e.target.value)}
          placeholder="この動画のメモを入力..."
        />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            🗑️ {isDeleting ? '削除中...' : 'この投稿を削除'}
          </button>
          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};
