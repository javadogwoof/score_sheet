import { useCallback, useEffect, useState } from 'react';
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
import type { Video } from '@/lib/domain/types';
import { NotFoundError } from '@/lib/errors';
import {
  addReflectionToVideo,
  getVideosByDate,
  postVideo,
} from '@/lib/repositories/reflectionRepository';
import { extractYouTubeVideoId } from '@/lib/youtube';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const { isOpen, open, close } = usePostModal();
  const [videos, setVideos] = useState<Video[]>([]);
  const { pageState, setLoading, setSuccess, setError, setEmpty } =
    usePageState();
  const { reportError } = usePostHog();

  // データ読み込み
  const loadVideos = useCallback(async () => {
    if (!date) return;

    setLoading();

    try {
      const data = await getVideosByDate(date);
      setVideos(data);
      data.length === 0 ? setEmpty() : setSuccess();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, { context: 'loadVideos', date });
      }
      setError('データの読み込みに失敗しました');
    }
  }, [date, reportError, setEmpty, setError, setLoading, setSuccess]);

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

      const newVideo: Video = {
        id: videoId,
        videoId: youtubeVideoId,
        posts: [],
      };
      setVideos((prev) => [...prev, newVideo]);
      setSuccess();
      close();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, { context: 'createVideo', videoUrl, date });
      }
      setError('動画の追加に失敗しました');
    }
  };

  const handleAddPost = async (videoId: string, content: string) => {
    if (!content) return;

    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    try {
      // 新しい投稿を作成
      const newPostId = await addReflectionToVideo(videoId, content);

      // optimisticに表示を更新
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                posts: [
                  ...v.posts,
                  {
                    id: newPostId,
                    content,
                  },
                ],
              }
            : v,
        ),
      );
    } catch (error) {
      console.error('Failed to add post:', error);
      if (error instanceof Error) {
        reportError(error, { context: 'addPost', videoId });
      }

      if (error instanceof NotFoundError) {
        setError('動画が見つかりません。ページを再読み込みしてください。');
      } else {
        setError('投稿の追加に失敗しました');
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
              onAddPost={(content) => handleAddPost(video.id, content)}
            />
          ))}
      </AppMain>
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
    </>
  );
};

export default DailyPage;
