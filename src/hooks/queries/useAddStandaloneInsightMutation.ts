import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStandaloneInsight } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

interface AddStandaloneInsightParams {
  date: string;
  content: string;
}

export const useAddStandaloneInsightMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, content }: AddStandaloneInsightParams) => {
      await addStandaloneInsight(date, content);
    },
    onSuccess: (_data, variables) => {
      // 該当日付の投稿キャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: videoKeys.postsByDate(variables.date),
      });
    },
  });
};
