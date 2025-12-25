import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVideo } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useDeleteVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await deleteVideo(videoId);
    },
    onSuccess: () => {
      // 全てのbyDateクエリを無効化（動画一覧を再取得）
      queryClient.invalidateQueries({
        queryKey: videoKeys.all,
        predicate: (query) => query.queryKey[1] === 'byDate',
      });
    },
  });
};
