import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/lib/repositories/reflectionRepository';
import { videoKeys } from './keys';

export const useAllPostsQuery = () => {
  return useQuery({
    queryKey: videoKeys.allPosts(),
    queryFn: getAllPosts,
  });
};
