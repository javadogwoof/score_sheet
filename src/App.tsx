import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from '@/App.module.scss';
import DailyPage from '@/pages/DailyPage';
import MonthlyPage from '@/pages/MonthlyPage';

function App() {
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MonthlyPage />} />
          <Route path="/daily/:date" element={<DailyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
