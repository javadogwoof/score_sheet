import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '@/lib/domain/types';
import { addGoal } from '@/lib/repositories/goalRepository';
import { goalKeys } from './keys';

interface AddGoalParams {
  title: string;
  description?: string;
  priority: Goal['priority'];
  deadline: string;
}

interface MutationContext {
  previousGoals: Goal[] | undefined;
}

export const useAddGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, AddGoalParams, MutationContext>({
    mutationFn: async (data) => {
      return await addGoal(data);
    },

    // 楽観的更新
    onMutate: async (newGoalData) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(goalKeys.all);

      const optimisticGoal: Goal = {
        id: crypto.randomUUID(),
        ...newGoalData,
        status: 'incomplete',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      queryClient.setQueryData<Goal[]>(goalKeys.all, (oldGoals) => {
        if (!oldGoals) return [optimisticGoal];
        return [...oldGoals, optimisticGoal];
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
