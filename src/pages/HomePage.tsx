import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';

const HomePage = () => {
  return (
    <>
      <AppHeader title="ホーム" />
      <AppMain>
        <EmptyState message="目標ページは準備中です" />
      </AppMain>
    </>
  );
};

export default HomePage;
