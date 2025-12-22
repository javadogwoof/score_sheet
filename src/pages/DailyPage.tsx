import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { IconButton } from '@/components/IconButton';
import { PostModal, usePostModal } from '@/features/PostModal';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import { extractYouTubeVideoId } from '@/lib/youtube';

interface VideoItem {
  id: string;
  videoId: string;
}

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const { isOpen, open, close } = usePostModal();
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const handleSubmit = (videoUrl: string) => {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) return;

    const newVideo: VideoItem = {
      id: crypto.randomUUID(),
      videoId,
    };
    setVideos((prev) => [...prev, newVideo]);
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
        {videos.map((video) => (
          <YouTubePlayer key={video.id} videoId={video.videoId} />
        ))}
      </AppMain>
      <PostModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
    </>
  );
};

export default DailyPage;
