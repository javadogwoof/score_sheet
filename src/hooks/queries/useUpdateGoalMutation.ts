import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '@/lib/domain/types';
import { updateGoal } from '@/lib/repositories/goalRepository';
import { goalKeys } from './keys';

interface UpdateGoalParams {
  goalId: string;
  data: {
    title?: string;
    description?: string;
    priority?: Goal['priority'];
    deadline?: string;
    completed?: boolean;
  };
}

interface MutationContext {
  previousGoals: Goal[] | undefined;
}

export const useUpdateGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateGoalParams, MutationContext>({
    mutationFn: async ({ goalId, data }) => {
      await updateGoal(goalId, data);
    },

    // 楽観的更新
    onMutate: async ({ goalId, data }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(goalKeys.all);

      queryClient.setQueryData<Goal[]>(goalKeys.all, (oldGoals) => {
        if (!oldGoals) return oldGoals;

        return oldGoals.map((goal) => {
          if (goal.id !== goalId) return goal;

          return {
            ...goal,
            ...data,
            updatedAt: Date.now(),
          };
        });
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
