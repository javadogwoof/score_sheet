import { useState } from 'react';
import { extractYouTubeVideoId, isValidYouTubeVideoId } from '@/lib/youtube';
import styles from './VideoUrlModal.module.scss';

interface VideoUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (videoId: string) => void;
}

export const VideoUrlModal = ({ isOpen, onClose, onSubmit }: VideoUrlModalProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const videoId = extractYouTubeVideoId(url);

    if (!isValidYouTubeVideoId(videoId)) {
      setError('有効なYouTube URLまたはビデオIDを入力してください');
      return;
    }

    onSubmit(videoId!);
    setUrl('');
    onClose();
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>動画URLを入力</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="videoUrl" className={styles.label}>
              YouTube URL
            </label>
            <input
              type="text"
              id="videoUrl"
              className={styles.input}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.hint}>
            <p>対応フォーマット:</p>
            <ul>
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>VIDEO_ID (ビデオIDのみ)</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton}>
              次へ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
