import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ErrorState } from '@/components/ErrorState';
import { GoalEditForm } from '@/features/GoalEditForm';
import { useGoalsQuery } from '@/hooks/queries/useGoalsQuery';
import { useUpdateGoalMutation } from '@/hooks/queries/useUpdateGoalMutation';
import type { GoalPriority } from '@/lib/domain/types';

const GoalDetailPage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { data: goals = [], isLoading } = useGoalsQuery();
  const updateGoalMutation = useUpdateGoalMutation();

  const goal = goals.find((g) => g.id === goalId);

  const handleSave = (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => {
    if (!goalId) return;

    updateGoalMutation.mutate(
      {
        goalId,
        data,
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <>
        <AppHeader title="目標詳細" showBackButton />
        <AppMain>
          <p>読み込み中...</p>
        </AppMain>
      </>
    );
  }

  if (!goal) {
    return (
      <>
        <AppHeader title="目標詳細" showBackButton />
        <AppMain>
          <ErrorState message="目標が見つかりませんでした" />
        </AppMain>
      </>
    );
  }

  return (
    <>
      <AppHeader title="目標詳細" showBackButton />
      <AppMain>
        <GoalEditForm goal={goal} onSave={handleSave} onCancel={handleCancel} />
      </AppMain>
    </>
  );
};

export default GoalDetailPage;
