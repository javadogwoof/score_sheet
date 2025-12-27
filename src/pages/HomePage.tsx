import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { GoalList } from '@/features/GoalList';
import { useDeleteGoalMutation } from '@/hooks/queries/useDeleteGoalMutation';
import { useGoalsQuery } from '@/hooks/queries/useGoalsQuery';
import { useUpdateGoalMutation } from '@/hooks/queries/useUpdateGoalMutation';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const { data: goals = [] } = useGoalsQuery();
  const updateGoalMutation = useUpdateGoalMutation();
  const deleteGoalMutation = useDeleteGoalMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // 未完了の目標のみを表示
  const incompleteGoals = useMemo(
    () => goals.filter((goal) => !goal.completed),
    [goals],
  );

  const handleCompleteGoal = (goalId: string) => {
    updateGoalMutation.mutate({
      goalId,
      data: { completed: true },
    });
  };

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (goalToDelete) {
      deleteGoalMutation.mutate({ goalId: goalToDelete });
      setGoalToDelete(null);
    }
  };

  return (
    <>
      <AppHeader title="ホーム" />
      <AppMain>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>未完了の目標</h2>
          {incompleteGoals.length === 0 ? (
            <EmptyState message="まだ目標がありません" />
          ) : (
            <GoalList
              goals={incompleteGoals}
              variant="detailed"
              onComplete={handleCompleteGoal}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </AppMain>
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="目標を削除"
        message="この目標を削除してもよろしいですか？この操作は取り消せません。"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default HomePage;
