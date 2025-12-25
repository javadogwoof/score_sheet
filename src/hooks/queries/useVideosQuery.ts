import { useQuery } from '@tanstack/react-query';
import { getVideosByDate } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useVideosQuery = (date: string | undefined) => {
  return useQuery({
    queryKey: videoKeys.byDate(date || ''),
    queryFn: () => {
      if (!date) {
        throw new Error('Date is required');
      }
      return getVideosByDate(date);
    },
    enabled: !!date,
  });
};
