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
import { NotFoundError } from '@/lib/errors';
import {
  getVideosByDate,
  postVideo,
  updateReflection,
} from '@/lib/repositories/reflectionRepository';
import { extractYouTubeVideoId } from '@/lib/youtube';

interface VideoItem {
  id: string;
  videoId: string;
  postId: string;
  memo: string;
}

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const { isOpen, open, close } = usePostModal();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const { pageState, setLoading, setSuccess, setError, setEmpty } =
    usePageState();
  const { reportError } = usePostHog();

  // データ読み込み
  const loadVideos = useCallback(async () => {
    if (!date) return;

    setLoading();

    try {
      const data = await getVideosByDate(date);
      const items: VideoItem[] = data.map((item) => ({
        id: item.video.id,
        videoId: item.video.videoId,
        postId: item.posts[0]?.id || '',
        memo: item.posts[0]?.contents || '',
      }));
      setVideos(items);
      items.length === 0 ? setEmpty() : setSuccess();
    } catch (error) {
      console.error('Failed to load videos:', error);
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
      const result = await postVideo(videoId, youtubeVideoId, date);

      const newVideo: VideoItem = {
        id: result.videoId,
        videoId: youtubeVideoId,
        postId: result.postId,
        memo: '',
      };
      setVideos((prev) => [...prev, newVideo]);
      setSuccess();
      close();
    } catch (error) {
      console.error('Failed to create video:', error);
      if (error instanceof Error) {
        reportError(error, { context: 'createVideo', videoUrl, date });
      }
      setError('動画の追加に失敗しました');
    }
  };

  const handleMemoChange = async (id: string, memo: string) => {
    const video = videos.find((v) => v.id === id);
    if (!video) return;

    const previousMemo = video.memo;

    // 楽観的更新
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, memo } : v)));

    try {
      await updateReflection(video.postId, memo);
    } catch (error) {
      console.error('Failed to update memo:', error);
      if (error instanceof Error) {
        reportError(error, { context: 'updateMemo', videoId: id });
      }
      // エラー時は元に戻す
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, memo: previousMemo } : v)),
      );

      // エラータイプに応じたメッセージを表示
      if (error instanceof NotFoundError) {
        setError('投稿が見つかりません。ページを再読み込みしてください。');
      } else {
        setError('メモの保存に失敗しました');
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
              memo={video.memo}
              onMemoChange={(memo) => handleMemoChange(video.id, memo)}
            />
          ))}
      </AppMain>
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
    </>
  );
};

export default DailyPage;
