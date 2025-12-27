import { useQuery } from '@tanstack/react-query';
import type { Goal } from '@/lib/domain/types';
import { getAllGoals } from '@/lib/repositories/goalRepository';
import { goalKeys } from './keys';

export const useGoalsQuery = () => {
  return useQuery<Goal[], Error>({
    queryKey: goalKeys.all,
    queryFn: getAllGoals,
  });
};
