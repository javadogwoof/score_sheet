import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReflection } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useDeletePostMutation = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      await deleteReflection(postId);
    },
    onSuccess: () => {
      // 該当Videoのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: videoKeys.byId(videoId) });
    },
  });
};
