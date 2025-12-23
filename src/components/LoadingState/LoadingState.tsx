import styles from './LoadingState.module.scss';

interface LoadingProps {
  message?: string;
}

export const LoadingState = ({ message = '読み込み中...' }: LoadingProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
};
