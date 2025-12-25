import { useQuery } from '@tanstack/react-query';
import { getVideoById } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useVideoQuery = (videoId: string) => {
  return useQuery({
    queryKey: videoKeys.byId(videoId),
    queryFn: () => getVideoById(videoId),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュを使用
  });
};
