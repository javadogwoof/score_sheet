import { useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { PostModal, usePostModal } from '@/features/PostModal';
import { VideoCard } from '@/features/VideoCard';
import { usePageState } from '@/hooks/usePageState';
import { usePostHog } from '@/hooks/usePostHog';
import { useVideosState } from '@/hooks/useVideosState';
import { postVideo } from '@/lib/repositories/reflectionRepository';
import { extractYouTubeVideoId } from '@/lib/youtube';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const { isOpen, open, close } = usePostModal();
  const { videos, loading, error, loadVideos, addPost } = useVideosState(date);
  const { pageState, setLoading, setSuccess, setError, setEmpty } =
    usePageState();
  const { reportError } = usePostHog();

  useEffect(() => {
    if (loading) {
      setLoading();
    } else if (error) {
      setError(error);
    } else if (videos.length === 0) {
      setEmpty();
    } else {
      setSuccess();
    }
  }, [
    loading,
    error,
    videos.length,
    setLoading,
    setError,
    setEmpty,
    setSuccess,
  ]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleSubmit = async (videoUrl: string) => {
    if (!date) return;

    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) return;

    try {
      const videoId = crypto.randomUUID();
      await postVideo(videoId, youtubeVideoId, date);
      await loadVideos();
      close();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, { context: 'createVideo', videoUrl, date });
      }
      setError('動画の追加に失敗しました');
    }
  };

  return (
    <>
      <AppHeader
        subtitle={date}
        showBackButton
        actionButton={
          <IconButton icon={<IoAdd />} onClick={open} ariaLabel="動画を追加" />
        }
      />
      <AppMain>
        {pageState.status === 'loading' && <LoadingState />}
        {pageState.status === 'error' && (
          <ErrorState message={pageState.message} onRetry={loadVideos} />
        )}
        {pageState.status === 'empty' && (
          <EmptyState message="まだ動画がありません" />
        )}
        {pageState.status === 'success' &&
          videos.map((video) => (
            <VideoCard
              key={video.id}
              videoId={video.videoId}
              posts={video.posts}
              onAddPost={(content) => addPost(video.id, content)}
            />
          ))}
      </AppMain>
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
    </>
  );
};

export default DailyPage;
