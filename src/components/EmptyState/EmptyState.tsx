import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <div className={styles.container}>{message}</div>;
};
