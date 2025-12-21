import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import styles from './DailyPage.module.scss';

const DailyPage = () => {
  const { date } = useParams<{ date: string }>();

  return (
    <div className={styles.container}>
      <AppHeader subtitle={date} showBackButton />

      <YouTubePlayer videoId="FO6P4FoLRPU" />
    </div>
  );
};

export default DailyPage;
