import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DailyPage from '@/pages/DailyPage';
import MonthlyPage from '@/pages/MonthlyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MonthlyPage />} />
        <Route path="/daily/:date" element={<DailyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
