import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  return <div className={styles.container}>{message}</div>;
};
