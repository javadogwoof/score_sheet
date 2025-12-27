import dayjs from 'dayjs';
import { Card } from '@/components/Card/Card';
import type { Goal } from '@/lib/domain/types';
import styles from './GoalList.module.scss';

interface GoalListProps {
  goals: Goal[];
}

const getPriorityLabel = (priority: Goal['priority']) => {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
  }
};

const getPriorityClass = (priority: Goal['priority']) => {
  switch (priority) {
    case 'high':
      return styles.priorityHigh;
    case 'medium':
      return styles.priorityMedium;
    case 'low':
      return styles.priorityLow;
  }
};

export const GoalList = ({ goals }: GoalListProps) => {
  if (goals.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      {goals.map((goal) => (
        <Card key={goal.id} className={styles.goalCard}>
          <div className={styles.header}>
            <h3 className={styles.title}>{goal.title}</h3>
            <span className={`${styles.priority} ${getPriorityClass(goal.priority)}`}>
              {getPriorityLabel(goal.priority)}
            </span>
          </div>
          {goal.description && (
            <p className={styles.description}>{goal.description}</p>
          )}
          <div className={styles.footer}>
            <span className={styles.deadline}>
              期限: {dayjs(goal.deadline).format('YYYY年M月D日')}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
