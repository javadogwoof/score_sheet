import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';

const VideosPage = () => {
  return (
    <>
      <AppHeader title="動画" />
      <AppMain>
        <EmptyState message="動画ページは準備中です" />
      </AppMain>
    </>
  );
};

export default VideosPage;
