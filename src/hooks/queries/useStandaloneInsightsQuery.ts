import { useQuery } from '@tanstack/react-query';
import { getStandaloneInsightsByDate } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useStandaloneInsightsQuery = (date: string) => {
  return useQuery({
    queryKey: [...videoKeys.all, 'standaloneInsights', date],
    queryFn: () => getStandaloneInsightsByDate(date),
  });
};
