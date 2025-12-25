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
      // YouTube APIからタイトル取得
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeVideoId}&format=json`;
      let title = ''; // デフォルトは空文字列

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          title = data.title || '';
        }
      } catch (_error) {
        // YouTube API取得失敗時は空文字列でDB保存
        // ユーザーは後から編集可能
      }

      // DBに保存（タイトル含む）
      await postVideo(videoId, youtubeVideoId, date, title);
      return { videoId, youtubeVideoId, date };
    },
    onSuccess: ({ date }) => {
      // キャッシュを無効化して再取得（シンプルな方法）
      queryClient.invalidateQueries({ queryKey: videoKeys.byDate(date) });
    },
  });
};
