import { useQuery } from '@tanstack/react-query';
import {
  getPostsByDate,
  getPostsByMonth,
} from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const usePostsByMonthQuery = (yearMonth: string) => {
  return useQuery({
    queryKey: videoKeys.postsByMonth(yearMonth),
    queryFn: () => getPostsByMonth(yearMonth),
  });
};

export const usePostsByDateQuery = (date: string) => {
  return useQuery({
    queryKey: videoKeys.postsByDate(date),
    queryFn: () => getPostsByDate(date),
  });
};
