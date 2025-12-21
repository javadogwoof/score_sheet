import type { CardProps } from '@/components/Card/types.ts';
import styles from './Card.module.scss';

export const Card = ({ children }: CardProps) => {
  return <div className={styles.container}>{children}</div>;
};
