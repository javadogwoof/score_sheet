import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from '@/App.module.scss';
import CalendarPage from '@/pages/CalendarPage';
import RetrospectivePage from '@/pages/RetrospectivePage';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/retrospective/:date" element={<RetrospectivePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
