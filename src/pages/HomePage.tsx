import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { GoalList } from '@/features/GoalList';
import { useGoalsQuery } from '@/hooks/queries/useGoalsQuery';
import { useUpdateGoalMutation } from '@/hooks/queries/useUpdateGoalMutation';

const HomePage = () => {
  const { data: goals = [] } = useGoalsQuery();
  const updateGoalMutation = useUpdateGoalMutation();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [goalToComplete, setGoalToComplete] = useState<string | null>(null);

  // 未達成の目標のみを表示
  const incompleteGoals = useMemo(
    () => goals.filter((goal) => goal.status === 'incomplete'),
    [goals],
  );

  const handleCompleteClick = (goalId: string) => {
    setGoalToComplete(goalId);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteConfirm = () => {
    if (goalToComplete) {
      updateGoalMutation.mutate({
        goalId: goalToComplete,
        data: { status: 'completed' },
      });
      setGoalToComplete(null);
      setIsCompleteModalOpen(false);
    }
  };

  return (
    <>
      <AppHeader title="ホーム" />
      <AppMain>
        <h2
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: '#333',
          }}
        >
          未達成の目標
        </h2>
        {incompleteGoals.length === 0 ? (
          <EmptyState message="まだ目標がありません" />
        ) : (
          <GoalList
            goals={incompleteGoals}
            variant="detailed"
            onComplete={handleCompleteClick}
          />
        )}
      </AppMain>
      <ConfirmDialog
        isOpen={isCompleteModalOpen}
        title="目標を達成"
        message="この目標を達成済みにしてもよろしいですか？"
        confirmText="目標達成🎉"
        confirmVariant="notice"
        onConfirm={handleCompleteConfirm}
        onCancel={() => setIsCompleteModalOpen(false)}
      />
    </>
  );
};

export default HomePage;
