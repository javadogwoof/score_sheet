import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInsight } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useDeletePostMutation = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      await deleteInsight(postId);
    },
    onSuccess: () => {
      // 該当Videoのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: videoKeys.byId(videoId) });
      // 全ての月のpostsByMonthキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: videoKeys.all,
        predicate: (query) => query.queryKey[1] === 'postsByMonth',
      });
    },
  });
};
