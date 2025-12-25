import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { VideoCard } from '@/features/VideoCard';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>();

  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useVideoQuery(videoId || '');

  if (!videoId) {
    return (
      <>
        <AppHeader showBackButton />
        <AppMain>
          <ErrorState message="動画IDが見つかりません" />
        </AppMain>
      </>
    );
  }

  return (
    <>
      <AppHeader showBackButton />
      <AppMain>
        {isLoading && <LoadingState />}
        {error && (
          <ErrorState
            message="動画の読み込みに失敗しました"
            onRetry={refetch}
          />
        )}
        {!isLoading && !error && video && (
          <VideoCard id={videoId} videoId={video.videoId} />
        )}
      </AppMain>
    </>
  );
};

export default VideoPage;
