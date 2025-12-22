import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import Calendar from '@/components/Calendar';
import { Card } from '@/components/Card/Card';
import { formatDate } from '@/lib/date';

const MonthlyPage = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    navigate(`/daily/${dateStr}`);
  };

  // PostHogのエラートラッキングテスト用（開発環境のみ）
  const testPostHogError = () => {
    throw new Error('PostHog test error - this is intentional');
  };

  return (
    <>
      <AppHeader title="ふりかえりカレンダー" />
      <AppMain>
        <Card>
          <Calendar onDateSelect={handleDateSelect} />
        </Card>
        <div style={{ padding: '16px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={testPostHogError}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Test PostHog Error Tracking
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            このボタンをクリックすると意図的にエラーを発生させ、PostHogに送信されます
          </p>
        </div>
      </AppMain>
    </>
  );
};

export default MonthlyPage;
