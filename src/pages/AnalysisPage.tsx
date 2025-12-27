import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { EmptyState } from '@/components/EmptyState';

const AnalysisPage = () => {
  return (
    <>
      <AppHeader title="自己分析" />
      <AppMain>
        <EmptyState message="自己分析ページは準備中です" />
      </AppMain>
    </>
  );
};

export default AnalysisPage;
