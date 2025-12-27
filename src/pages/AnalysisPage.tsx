import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/features/PostCard';
import { useAllPostsQuery } from '@/hooks/queries/useAllPostsQuery';

const AnalysisPage = () => {
  const navigate = useNavigate();

  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = useAllPostsQuery();

  const handleVideoClick = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  return (
    <>
      <AppHeader title="自己分析" />
      <AppMain>
        {isLoading && <LoadingState />}
        {error && (
          <ErrorState
            message="データの読み込みに失敗しました"
            onRetry={refetch}
          />
        )}
        {!isLoading && !error && posts.length === 0 && (
          <EmptyState message="まだ投稿がありません" />
        )}
        {!isLoading &&
          !error &&
          posts.length > 0 &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              postId={post.id}
              postContent={post.content}
              postCreatedAt={post.createdAt}
              videoTitle={post.videoTitle}
              videoDate={post.videoDate}
              onVideoClick={() => handleVideoClick(post.videoId)}
            />
          ))}
      </AppMain>
    </>
  );
};

export default AnalysisPage;
