import { useMemo } from 'react';
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
import { useAddVideoMutation } from '@/hooks/queries/useAddVideoMutation';
import { useVideosQuery } from '@/hooks/queries/useVideosQuery';
import { usePostHog } from '@/hooks/usePostHog';
import { extractYouTubeVideoId } from '@/lib/youtube';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const { isOpen, open, close } = usePostModal();
  const { reportError } = usePostHog();

  const {
    data: videos = [],
    isLoading: isLoadingVideos,
    error: videosError,
    refetch: refetchVideos,
  } = useVideosQuery(date);

  const addVideoMutation = useAddVideoMutation();

  const displayError = useMemo(() => {
    if (videosError) return 'データの読み込みに失敗しました';
    if (addVideoMutation.error) return '動画の追加に失敗しました';
    return null;
  }, [videosError, addVideoMutation.error]);

  const isLoading = isLoadingVideos || addVideoMutation.isPending;

  const handleSubmit = async (videoUrl: string) => {
    if (!date) return;

    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) return;

    try {
      const videoId = crypto.randomUUID();
      await addVideoMutation.mutateAsync({
        videoId,
        youtubeVideoId,
        date,
      });
      close();
    } catch (err) {
      if (err instanceof Error) {
        reportError(err, { context: 'createVideo', videoUrl, date });
      }
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
        {isLoading && <LoadingState />}
        {displayError && (
          <ErrorState
            message={displayError}
            onRetry={() => {
              if (videosError) {
                refetchVideos();
              }
            }}
          />
        )}
        {!isLoading && !displayError && videos.length === 0 && (
          <EmptyState message="まだ動画がありません" />
        )}
        {!isLoading &&
          !displayError &&
          videos.length > 0 &&
          date &&
          videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              videoId={video.videoId}
              initialPosts={video.posts}
              date={date}
            />
          ))}
      </AppMain>
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
    </>
  );
};

export default DailyPage;
