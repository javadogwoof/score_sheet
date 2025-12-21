import type * as React from 'react';
import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import type { Memo, YoutubeVideoIdDTO } from '@/lib/storage';
import styles from './VideoWithMemo.module.scss';

interface VideoWithMemoProps {
  video: YoutubeVideoIdDTO;
  memo: Memo;
}

export const VideoWithMemo = ({ video, memo }: VideoWithMemoProps) => {
  const [memoContent, setMemoContent] = useState(memo?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
  };

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) {
      return;
    }
    setIsDeleting(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        <YouTubePlayer videoId={video.source} />
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
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};
