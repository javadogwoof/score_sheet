import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '@/lib/domain/types';
import { deleteGoal } from '@/lib/repositories/goalRepository';
import { goalKeys } from './keys';

interface DeleteGoalParams {
  goalId: string;
}

interface MutationContext {
  previousGoals: Goal[] | undefined;
}

export const useDeleteGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteGoalParams, MutationContext>({
    mutationFn: async ({ goalId }) => {
      await deleteGoal(goalId);
    },

    // 楽観的更新
    onMutate: async ({ goalId }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(goalKeys.all);

      queryClient.setQueryData<Goal[]>(goalKeys.all, (oldGoals) => {
        if (!oldGoals) return oldGoals;
        return oldGoals.filter((goal) => goal.id !== goalId);
      });

      return { previousGoals };
    },

    // 成功時: DBから正しいデータを再取得
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },

    // エラー時: ロールバック
    onError: (_error, _variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData<Goal[]>(goalKeys.all, context.previousGoals);
      }
    },
  });
};
