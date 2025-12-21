import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from '@/App.module.scss';
import DailyPage from '@/pages/DailyPage';
import MonthlyPage from '@/pages/MonthlyPage';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<MonthlyPage />} />
          <Route path="/daily/:date" element={<DailyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
