import { useMemo, useState } from 'react';
import { GoalList } from '@/features/GoalList';
import { GoalQuickAdd } from '@/features/GoalQuickAdd';
import type { Goal, GoalPriority } from '@/lib/domain/types';
import styles from './GoalSection.module.scss';

export const GoalSection = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  // 未完了の目標のみを表示
  const incompleteGoals = useMemo(
    () => goals.filter((goal) => !goal.completed),
    [goals],
  );

  const handleAddGoal = (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      ...data,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setGoals([...goals, newGoal]);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>今月の目標</h2>
      <GoalList goals={incompleteGoals} />
      <GoalQuickAdd onAdd={handleAddGoal} />
    </div>
  );
};
