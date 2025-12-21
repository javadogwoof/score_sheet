import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import styles from './DailyPage.module.scss';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();

  return (
    <div className={styles.container}>
      <AppHeader subtitle={date} showBackButton />
      <AppMain>
        <YouTubePlayer videoId="FO6P4FoLRPU" />
      </AppMain>
    </div>
  );
};

export default DailyPage;
