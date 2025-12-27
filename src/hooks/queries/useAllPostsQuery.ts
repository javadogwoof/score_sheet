import { useQuery } from '@tanstack/react-query';
import { getPostsByMonth } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const usePostsByMonthQuery = (yearMonth: string) => {
  return useQuery({
    queryKey: videoKeys.postsByMonth(yearMonth),
    queryFn: () => getPostsByMonth(yearMonth),
  });
};
