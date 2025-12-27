import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import AnalysisPage from '@/pages/AnalysisPage';
import DailyPage from '@/pages/DailyPage';
import HomePage from '@/pages/HomePage';
import VideoPage from '@/pages/VideoPage';
import VideosPage from '@/pages/VideosPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Route>

          {/* フッタータブなしのページ */}
          <Route path="/daily/:date" element={<DailyPage />} />
          <Route path="/videos/:videoId" element={<VideoPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </ErrorBoundary>
  );
}

export default App;
