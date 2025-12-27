import dayjs from 'dayjs';
import { Card } from '@/components/Card';
import styles from './InsightCard.module.scss';

interface InsightCardProps {
  content: string;
  createdAt: number;
  onClick?: () => void;
}

export const InsightCard = ({
  content,
  createdAt,
  onClick,
}: InsightCardProps) => {
  return (
    <Card className={styles.card} onClick={onClick}>
      <p className={styles.content}>{content}</p>
      <span className={styles.timestamp}>
        {dayjs(createdAt).format('HH:mm')}
      </span>
    </Card>
  );
};
