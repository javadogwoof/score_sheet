import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VideoUrlModalProvider } from '@/contexts/VideoUrlModalContext';
import styles from '@/App.module.scss';
import CalendarPage from '@/pages/CalendarPage';
import RetrospectivePage from '@/pages/RetrospectivePage';

function App() {
  return (
    <BrowserRouter>
      <VideoUrlModalProvider>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/retrospective/:date" element={<RetrospectivePage />} />
          </Routes>
        </div>
      </VideoUrlModalProvider>
    </BrowserRouter>
  );
}

export default App;
