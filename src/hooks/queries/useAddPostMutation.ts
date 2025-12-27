import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, Video } from '@/lib/domain/types';
import { addReflectionToVideo } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

interface AddPostParams {
  videoId: string;
  content: string;
}

interface MutationContext {
  previousVideo: Video | undefined;
}

export const useAddPostMutation = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddPostParams, MutationContext>({
    mutationFn: async ({ videoId, content }) => {
      await addReflectionToVideo(videoId, content);
    },

    // 楽観的更新: mutationFn実行前
    onMutate: async ({ content }) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: videoKeys.byId(videoId) });

      // 現在のキャッシュをバックアップ
      const previousVideo = queryClient.getQueryData<Video>(
        videoKeys.byId(videoId),
      );

      // 楽観的更新を適用
      const newPost: Post = {
        id: crypto.randomUUID(),
        content,
      };

      queryClient.setQueryData<Video>(videoKeys.byId(videoId), (oldVideo) => {
        if (!oldVideo) return oldVideo;

        return {
          ...oldVideo,
          posts: [...oldVideo.posts, newPost],
        };
      });

      return { previousVideo };
    },

    // 成功時: DBから正しいデータを再取得
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.byId(videoId) });
      // 全ての月のpostsByMonthキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: videoKeys.all,
        predicate: (query) => query.queryKey[1] === 'postsByMonth',
      });
    },

    // エラー時: ロールバック
    onError: (_error, _variables, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData<Video>(
          videoKeys.byId(videoId),
          context.previousVideo,
        );
      }
    },
  });
};
