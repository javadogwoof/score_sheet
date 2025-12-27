import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Video } from '@/lib/domain/types';
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

      // 動画の日付を取得してpostsByDateキャッシュを無効化
      const video = queryClient.getQueryData<Video>(videoKeys.byId(videoId));
      if (video?.date) {
        queryClient.invalidateQueries({ queryKey: videoKeys.postsByDate(video.date) });
      }

      // 全ての月のpostsByMonthキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: videoKeys.all,
        predicate: (query) => query.queryKey[1] === 'postsByMonth',
      });
    },
  });
};
