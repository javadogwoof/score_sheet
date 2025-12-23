import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          再試行
        </button>
      )}
    </div>
  );
};
