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
        <div key={goal.id} className={styles.goalItem}>
          <div className={styles.header}>
            <span className={styles.title}>{goal.title}</span>
            <span
              className={`${styles.priority} ${getPriorityClass(goal.priority)}`}
            >
              {getPriorityLabel(goal.priority)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
