import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { IoCalendar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { CalendarModal } from '@/components/CalendarModal';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/features/PostCard';
import { InsightQuickAdd } from '@/features/InsightQuickAdd';
import { VideoSummaryCard } from '@/features/VideoSummaryCard';
import { useAddStandaloneInsightMutation } from '@/hooks/queries/useAddStandaloneInsightMutation';
import { useAddVideoMutation } from '@/hooks/queries/useAddVideoMutation';
import { usePostsByDateQuery } from '@/hooks/queries/useAllPostsQuery';
import { useVideosQuery } from '@/hooks/queries/useVideosQuery';
import { usePostHog } from '@/hooks/usePostHog';
import { extractYouTubeVideoId } from '@/lib/youtube';
import styles from './InsightsPage.module.scss';

const InsightsPage = () => {
  const navigate = useNavigate();
  const { reportError } = usePostHog();

  // 今日の日付をデフォルトとして使用
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format('YYYY-MM-DD'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    data: videoSummaries = [],
    isLoading: isLoadingVideos,
    error: videosError,
    refetch: refetchVideos,
  } = useVideosQuery(selectedDate);

  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    error: postsError,
    refetch: refetchPosts,
  } = usePostsByDateQuery(selectedDate);

  const addVideoMutation = useAddVideoMutation();
  const addInsightMutation = useAddStandaloneInsightMutation();

  const displayError = useMemo(() => {
    if (videosError || postsError) return 'データの読み込みに失敗しました';
    if (addVideoMutation.error || addInsightMutation.error) return '気付きの追加に失敗しました';
    return null;
  }, [videosError, postsError, addVideoMutation.error, addInsightMutation.error]);

  const isLoading = isLoadingVideos || isLoadingPosts || addVideoMutation.isPending || addInsightMutation.isPending;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
  };

  const handleVideoClick = (videoInternalId: string) => {
    navigate(`/insights/${videoInternalId}`);
  };

  const handleAddVideo = async (videoUrl: string) => {
    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) return;

    try {
      const videoId = crypto.randomUUID();
      await addVideoMutation.mutateAsync({
        videoId,
        youtubeVideoId,
        date: selectedDate,
      });
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

  const handleAddInsight = async (content: string) => {
    try {
      await addInsightMutation.mutateAsync({
        date: selectedDate,
        content,
      });
    } catch (err) {
      if (err instanceof Error) {
        reportError(err, {
          context: 'createInsight',
          date: selectedDate,
        });
      }
    }
  };

  return (
    <>
      <AppHeader
        title={dayjs(selectedDate).format('YYYY年M月D日')}
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
              if (videosError) refetchVideos();
              if (postsError) refetchPosts();
            }}
          />
        )}

        {!isLoading && !displayError && (
          <>
            {/* 動画セクション */}
            {videoSummaries.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>動画</h2>
                {videoSummaries.map((video) => (
                  <VideoSummaryCard
                    key={video.id}
                    youtubeVideoId={video.youtubeVideoId}
                    title={video.title}
                    onClick={() => navigate(`/insights/${video.id}`)}
                  />
                ))}
              </div>
            )}

            {/* 気付き投稿セクション */}
            {posts.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>気付き</h2>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    postId={post.id}
                    postContent={post.content}
                    postCreatedAt={post.createdAt}
                    videoTitle={post.videoTitle}
                    onVideoClick={
                      post.videoInternalId
                        ? () => handleVideoClick(post.videoInternalId!)
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {videoSummaries.length === 0 && posts.length === 0 && (
              <EmptyState message="まだ気付きがありません" />
            )}
          </>
        )}
      </AppMain>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
        selectedDate={dayjs(selectedDate).toDate()}
      />

      <InsightQuickAdd
        onAddVideo={handleAddVideo}
        onAddInsight={handleAddInsight}
      />
    </>
  );
};

export default InsightsPage;
