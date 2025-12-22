import styles from './Loading.module.scss';

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = '読み込み中...' }: LoadingProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
};
