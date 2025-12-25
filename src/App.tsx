import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DailyPage from '@/pages/DailyPage';
import MonthlyPage from '@/pages/MonthlyPage';
import VideoPage from '@/pages/VideoPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MonthlyPage />} />
          <Route path="/daily/:date" element={<DailyPage />} />
          <Route path="/videos/:videoId" element={<VideoPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </ErrorBoundary>
  );
}

export default App;
