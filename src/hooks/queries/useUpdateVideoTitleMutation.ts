import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVideoTitle } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useUpdateVideoTitleMutation = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      await updateVideoTitle(videoId, title);
    },
    onSuccess: () => {
      // 該当VideoのキャッシュをinvalidateQueries
      queryClient.invalidateQueries({ queryKey: videoKeys.byId(videoId) });

      // VideoSummaryのキャッシュも更新（DailyPageで表示されるため）
      // 全てのbyDateクエリをinvalidate
      queryClient.invalidateQueries({
        queryKey: videoKeys.all,
        predicate: (query) => query.queryKey[1] === 'byDate',
      });

      // 自己分析ページのキャッシュも更新
      queryClient.invalidateQueries({ queryKey: videoKeys.allPosts() });
    },
  });
};
