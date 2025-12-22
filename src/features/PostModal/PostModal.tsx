import { useState } from 'react';
import { Modal } from '@/components/Modal';
import styles from './PostModal.module.scss';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (videoUrl: string) => void;
}

export const PostModal = ({ isOpen, onClose, onSubmit }: PostModalProps) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      onSubmit(videoUrl);
      setVideoUrl('');
      onClose();
    }
  };

  const handleClose = () => {
    setVideoUrl('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="動画を追加">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="videoUrl" className={styles.label}>
            動画URL
          </label>
          <input
            id="videoUrl"
            type="url"
            className={styles.input}
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            キャンセル
          </button>
          <button type="submit" className={styles.submitButton}>
            追加
          </button>
        </div>
      </form>
    </Modal>
  );
};
