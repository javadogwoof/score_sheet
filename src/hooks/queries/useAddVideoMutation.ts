import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postVideo } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

interface AddVideoParams {
  videoId: string;
  youtubeVideoId: string;
  date: string;
}

export const useAddVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, youtubeVideoId, date }: AddVideoParams) => {
      await postVideo(videoId, youtubeVideoId, date);
      return { videoId, youtubeVideoId, date };
    },
    onSuccess: ({ date }) => {
      // キャッシュを無効化して再取得（シンプルな方法）
      queryClient.invalidateQueries({ queryKey: videoKeys.byDate(date) });
    },
  });
};
