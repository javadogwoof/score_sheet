import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { YouTubePlayer } from '@/components/YouTubePlayer';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();

  return (
    <>
      <AppHeader subtitle={date} showBackButton />
      <AppMain>
        <YouTubePlayer videoId="FO6P4FoLRPU" />
      </AppMain>
    </>
  );
};

export default DailyPage;
