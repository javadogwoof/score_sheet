import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { TabNavigation } from '@/components/TabNavigation';
import { GoalList } from '@/features/GoalList';
import { GoalQuickAdd } from '@/features/GoalQuickAdd';
import { useAddGoalMutation } from '@/hooks/queries/useAddGoalMutation';
import { useGoalsQuery } from '@/hooks/queries/useGoalsQuery';
import { useUpdateGoalMutation } from '@/hooks/queries/useUpdateGoalMutation';
import type { GoalPriority } from '@/lib/domain/types';

type Tab = 'incomplete' | 'completed' | 'withdrawn';

const GoalsPage = () => {
  const { data: goals = [] } = useGoalsQuery();
  const addGoalMutation = useAddGoalMutation();
  const updateGoalMutation = useUpdateGoalMutation();

  const [activeTab, setActiveTab] = useState<Tab>('incomplete');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [goalToComplete, setGoalToComplete] = useState<string | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [goalToWithdraw, setGoalToWithdraw] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [goalToRestore, setGoalToRestore] = useState<string | null>(null);

  // タブごとの目標を表示
  const filteredGoals = useMemo(
    () => goals.filter((goal) => goal.status === activeTab),
    [goals, activeTab],
  );

  const handleAddGoal = (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => {
    addGoalMutation.mutate(data);
  };

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

  const handleWithdrawClick = (goalId: string) => {
    setGoalToWithdraw(goalId);
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawConfirm = () => {
    if (goalToWithdraw) {
      updateGoalMutation.mutate({
        goalId: goalToWithdraw,
        data: { status: 'withdrawn' },
      });
      setGoalToWithdraw(null);
      setIsWithdrawModalOpen(false);
    }
  };

  const handleRestoreClick = (goalId: string) => {
    setGoalToRestore(goalId);
    setIsRestoreModalOpen(true);
  };

  const handleRestoreConfirm = () => {
    if (goalToRestore) {
      updateGoalMutation.mutate({
        goalId: goalToRestore,
        data: { status: 'incomplete' },
      });
      setGoalToRestore(null);
      setIsRestoreModalOpen(false);
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'incomplete':
        return '未完了の目標がありません';
      case 'completed':
        return '完了した目標がありません';
      case 'withdrawn':
        return '取り下げた目標がありません';
    }
  };

  const tabs = [
    { value: 'incomplete' as const, label: '未完了' },
    { value: 'completed' as const, label: '完了済み' },
    { value: 'withdrawn' as const, label: '取り下げ' },
  ];

  return (
    <>
      <AppHeader title="目標設定" />
      <AppMain>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {filteredGoals.length === 0 ? (
          <EmptyState message={getEmptyMessage()} />
        ) : (
          <GoalList
            goals={filteredGoals}
            variant="detailed"
            onComplete={
              activeTab === 'incomplete' ? handleCompleteClick : undefined
            }
            onDelete={
              activeTab === 'incomplete' ? handleWithdrawClick : undefined
            }
            onRestore={
              activeTab !== 'incomplete' ? handleRestoreClick : undefined
            }
          />
        )}
        {activeTab === 'incomplete' && <GoalQuickAdd onAdd={handleAddGoal} />}
      </AppMain>
      <ConfirmDialog
        isOpen={isCompleteModalOpen}
        title="目標を完了"
        message="この目標を完了にしてもよろしいですか？"
        confirmText="完了"
        confirmVariant="notice"
        onConfirm={handleCompleteConfirm}
        onCancel={() => setIsCompleteModalOpen(false)}
      />
      <ConfirmDialog
        isOpen={isWithdrawModalOpen}
        title="目標を取り下げ"
        message="この目標を取り下げてもよろしいですか？"
        confirmText="取り下げる"
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setIsWithdrawModalOpen(false)}
      />
      <ConfirmDialog
        isOpen={isRestoreModalOpen}
        title="目標を未完了に戻す"
        message="この目標を未完了に戻してもよろしいですか？"
        confirmText="戻す"
        confirmVariant="notice"
        onConfirm={handleRestoreConfirm}
        onCancel={() => setIsRestoreModalOpen(false)}
      />
    </>
  );
};

export default GoalsPage;
