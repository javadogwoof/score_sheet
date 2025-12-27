import { useMemo } from 'react';
import { GoalList } from '@/features/GoalList';
import { GoalQuickAdd } from '@/features/GoalQuickAdd';
import { useAddGoalMutation } from '@/hooks/queries/useAddGoalMutation';
import { useGoalsQuery } from '@/hooks/queries/useGoalsQuery';
import type { GoalPriority } from '@/lib/domain/types';
import styles from './GoalSection.module.scss';

export const GoalSection = () => {
  const { data: goals = [] } = useGoalsQuery();
  const addGoalMutation = useAddGoalMutation();

  // 未達成の目標のみを表示
  const incompleteGoals = useMemo(
    () => goals.filter((goal) => goal.status === 'incomplete'),
    [goals],
  );

  const handleAddGoal = (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => {
    addGoalMutation.mutate(data);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>未達成の目標</h2>
      <GoalList goals={incompleteGoals} />
      <GoalQuickAdd onAdd={handleAddGoal} />
    </div>
  );
};
