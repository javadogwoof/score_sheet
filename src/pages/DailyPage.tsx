import { useParams } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { YouTubePlayer } from '@/components/YouTubePlayer';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();

  const handleAddVideo = () => {
    console.log('動画を追加');
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
    </>
  );
};

export default DailyPage;
