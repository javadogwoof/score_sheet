import { useQuery } from '@tanstack/react-query';
import type { Video } from '@/lib/domain/types';
import { videoKeys } from './keys';

export const useVideoQuery = (videoId: string, initialData?: Video) => {
  return useQuery({
    queryKey: videoKeys.byId(videoId),
    queryFn: () => {
      // initialDataがあればそれを返す（実際にはDBから取得しない）
      if (initialData) return initialData;
      throw new Error('Video data not found');
    },
    initialData,
    staleTime: Number.POSITIVE_INFINITY, // 初期データから変更しない
  });
};
