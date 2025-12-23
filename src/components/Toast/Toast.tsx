import { useEffect } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type = 'error',
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <p className={styles.message}>{message}</p>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
};
