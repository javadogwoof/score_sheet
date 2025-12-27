import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import AnalysisPage from '@/pages/AnalysisPage';
import DailyPage from '@/pages/DailyPage';
import GoalDetailPage from '@/pages/GoalDetailPage';
import GoalsPage from '@/pages/GoalsPage';
import HomePage from '@/pages/HomePage';
import InsightPage from '@/pages/InsightPage';
import InsightsPage from '@/pages/InsightsPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Route>

          {/* フッタータブなしのページ */}
          <Route path="/daily/:date" element={<DailyPage />} />
          <Route path="/insights/:videoId" element={<InsightPage />} />
          <Route path="/goals/:goalId" element={<GoalDetailPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </ErrorBoundary>
  );
}

export default App;
