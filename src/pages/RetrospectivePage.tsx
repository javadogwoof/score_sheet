import { useNavigate, useParams } from 'react-router-dom';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import styles from './RetrospectivePage.module.scss';

const RetrospectivePage = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
        >
          ← カレンダーに戻る
        </button>
        <h2 className={styles.date}>{date}</h2>
      </div>

      <YouTubePlayer videoId="FO6P4FoLRPU" />
    </div>
  );
};

export default RetrospectivePage;
