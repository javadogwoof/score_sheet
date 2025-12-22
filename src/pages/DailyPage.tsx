import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { Modal } from '@/components/Modal';
import { YouTubePlayer } from '@/components/YouTubePlayer';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddVideo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addButton = (
    <button
      type="button"
      onClick={handleAddVideo}
      style={{
        background: 'none',
        border: 'none',
        color: '#007bff',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
      }}
      aria-label="動画を追加"
    >
      <IoAdd />
    </button>
  );

  return (
    <>
      <AppHeader subtitle={date} showBackButton actionButton={addButton} />
      <AppMain>
        <YouTubePlayer videoId="FO6P4FoLRPU" />
      </AppMain>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="動画を追加">
        <p>ここに動画URLとメモの入力フォームが入ります</p>
      </Modal>
    </>
  );
};

export default DailyPage;
