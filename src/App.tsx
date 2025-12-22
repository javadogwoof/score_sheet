import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DailyPage from '@/pages/DailyPage';
import MonthlyPage from '@/pages/MonthlyPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MonthlyPage />} />
          <Route path="/daily/:date" element={<DailyPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
