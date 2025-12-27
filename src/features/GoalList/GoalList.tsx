import dayjs from 'dayjs';
import { IoArrowUndo, IoCheckmark, IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card/Card';
import type { Goal } from '@/lib/domain/types';
import styles from './GoalList.module.scss';

interface GoalListProps {
  goals: Goal[];
  variant?: 'simple' | 'detailed';
  onComplete?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onRestore?: (goalId: string) => void;
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

export const GoalList = ({
  goals,
  variant = 'simple',
  onComplete,
  onDelete,
  onRestore,
}: GoalListProps) => {
  const navigate = useNavigate();

  if (goals.length === 0) {
    return null;
  }

  const handleCardClick = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };

  if (variant === 'detailed') {
    return (
      <div className={styles.detailedList}>
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={styles.detailedCard}
            onClick={() => handleCardClick(goal.id)}
          >
            <div className={styles.cardHeader}>
              <span
                className={`${styles.priority} ${getPriorityClass(goal.priority)}`}
              >
                {getPriorityLabel(goal.priority)}
              </span>
              <h3 className={styles.cardTitle}>{goal.title}</h3>
            </div>
            {goal.description && (
              <p className={styles.description}>{goal.description}</p>
            )}
            <div className={styles.cardFooter}>
              <span className={styles.deadline}>
                期限: {dayjs(goal.deadline).format('YYYY年M月D日')}
              </span>
              <div className={styles.actions}>
                {onRestore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(goal.id);
                    }}
                    className={styles.restoreButton}
                    aria-label="未完了に戻す"
                  >
                    <IoArrowUndo />
                  </button>
                )}
                {onComplete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(goal.id);
                    }}
                    className={styles.completeButton}
                    aria-label="完了"
                  >
                    <IoCheckmark />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                    }}
                    className={styles.deleteButton}
                    aria-label="削除"
                  >
                    <IoTrash />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
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
