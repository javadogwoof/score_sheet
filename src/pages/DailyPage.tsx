import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { IconButton } from '@/components/IconButton';
import { PostModal } from '@/features/PostModal';
import { YouTubePlayer } from '@/features/YouTubePlayer';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddVideo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (videoUrl: string) => {
    console.log('動画URL:', videoUrl);
    // TODO: 動画プレーヤー+メモ欄のカードを追加
  };

  return (
    <>
      <AppHeader
        subtitle={date}
        showBackButton
        actionButton={
          <IconButton
            icon={<IoAdd />}
            onClick={handleAddVideo}
            ariaLabel="動画を追加"
          />
        }
      />
      <AppMain>
        <YouTubePlayer videoId="FO6P4FoLRPU" />
      </AppMain>
      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default DailyPage;
