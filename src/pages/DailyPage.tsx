import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { Loading } from '@/components/Loading';
import { PostModal, usePostModal } from '@/features/PostModal';
import { VideoCard } from '@/features/VideoCard';
import { usePageState } from '@/hooks/usePageState';
import {
  createVideoWithReflection,
  getVideosByDate,
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

  // データ読み込み
  useEffect(() => {
    const loadVideos = async () => {
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
        setError('データの読み込みに失敗しました');
      }
    };

    loadVideos();
  }, [date, setEmpty, setError, setLoading, setSuccess]);

  const handleSubmit = async (videoUrl: string) => {
    if (!date) return;

    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) return;

    try {
      const videoId = crypto.randomUUID();
      const result = await createVideoWithReflection(
        videoId,
        youtubeVideoId,
        date,
        '',
      );

      const newVideo: VideoItem = {
        id: result.videoId,
        videoId: youtubeVideoId,
        postId: result.postId,
        memo: '',
      };
      setVideos((prev) => [...prev, newVideo]);
      close();
    } catch (error) {
      console.error('Failed to create video:', error);
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
      // エラー時は元に戻す
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, memo: previousMemo } : v)),
      );
      setError('メモの保存に失敗しました');
    }
  };

  if (pageState.status === 'loading') {
    return <Loading />;
  }

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
        {pageState.status === 'error' && (
          <ErrorState message={pageState.message} />
        )}
        {pageState.status === 'empty' && (
          <EmptyState message="まだ動画がありません" />
        )}
        {videos.map((video) => (
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
