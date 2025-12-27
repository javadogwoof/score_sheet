import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { IoAdd, IoCalendar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { CalendarModal } from '@/components/CalendarModal';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { PostModal, usePostModal } from '@/features/PostModal';
import { VideoSummaryCard } from '@/features/VideoSummaryCard';
import { useAddVideoMutation } from '@/hooks/queries/useAddVideoMutation';
import { useVideosQuery } from '@/hooks/queries/useVideosQuery';
import { usePostHog } from '@/hooks/usePostHog';
import { extractYouTubeVideoId } from '@/lib/youtube';

const VideosPage = () => {
  const navigate = useNavigate();
  const { reportError } = usePostHog();

  // 今日の日付をデフォルトとして使用
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format('YYYY-MM-DD'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { isOpen, open, close } = usePostModal();

  const {
    data: videoSummaries = [],
    isLoading: isLoadingVideos,
    error: videosError,
    refetch: refetchVideos,
  } = useVideosQuery(selectedDate);

  const addVideoMutation = useAddVideoMutation();

  const displayError = useMemo(() => {
    if (videosError) return 'データの読み込みに失敗しました';
    if (addVideoMutation.error) return '動画の追加に失敗しました';
    return null;
  }, [videosError, addVideoMutation.error]);

  const isLoading = isLoadingVideos || addVideoMutation.isPending;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
  };

  const handleSubmit = async (videoUrl: string) => {
    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) return;

    try {
      const videoId = crypto.randomUUID();
      await addVideoMutation.mutateAsync({
        videoId,
        youtubeVideoId,
        date: selectedDate,
      });
      close();
    } catch (err) {
      if (err instanceof Error) {
        reportError(err, {
          context: 'createVideo',
          videoUrl,
          date: selectedDate,
        });
      }
    }
  };

  return (
    <>
      <AppHeader
        title={selectedDate}
        actionButton={
          <IconButton
            icon={<IoCalendar />}
            onClick={() => setIsCalendarOpen(true)}
            ariaLabel="日付を選択"
          />
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
        {!isLoading && !displayError && videoSummaries.length === 0 && (
          <EmptyState message="まだ動画がありません" />
        )}
        {!isLoading &&
          !displayError &&
          videoSummaries.length > 0 &&
          videoSummaries.map((video) => (
            <VideoSummaryCard
              key={video.id}
              videoId={video.videoId}
              title={video.title}
              onClick={() => navigate(`/videos/${video.id}`)}
            />
          ))}
      </AppMain>
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
        selectedDate={dayjs(selectedDate).toDate()}
      />
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
      <FloatingActionButton
        icon={<IoAdd />}
        onClick={open}
        ariaLabel="動画を追加"
      />
    </>
  );
};

export default VideosPage;
