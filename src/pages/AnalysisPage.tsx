import dayjs from 'dayjs';
import { useState } from 'react';
import { IoCalendar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { CalendarModal } from '@/components/CalendarModal';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { GoalSection } from '@/features/GoalSection';
import { PostCard } from '@/features/PostCard';
import { usePostsByMonthQuery } from '@/hooks/queries/useAllPostsQuery';
import styles from './AnalysisPage.module.scss';

const AnalysisPage = () => {
  const navigate = useNavigate();

  // 今月をデフォルトとして使用
  const [selectedMonth, setSelectedMonth] = useState(() =>
    dayjs().format('YYYY-MM'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = usePostsByMonthQuery(selectedMonth);

  const handleVideoClick = (videoInternalId: string) => {
    navigate(`/insights/${videoInternalId}`);
  };

  const handleMonthSelect = (date: Date) => {
    setSelectedMonth(dayjs(date).format('YYYY-MM'));
  };

  return (
    <>
      <AppHeader
        title={dayjs(selectedMonth).format('YYYY年M月')}
        actionButton={
          <IconButton
            icon={<IoCalendar />}
            onClick={() => setIsCalendarOpen(true)}
            ariaLabel="月を選択"
          />
        }
      />
      <AppMain>
        <GoalSection />

        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>
            {dayjs(selectedMonth).format('M月の気付き')}
          </h2>

          {isLoading && <LoadingState />}
          {error && (
            <ErrorState
              message="データの読み込みに失敗しました"
              onRetry={refetch}
            />
          )}
          {!isLoading && !error && posts.length === 0 && (
            <EmptyState message="まだ投稿がありません" />
          )}
          {!isLoading &&
            !error &&
            posts.length > 0 &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                postId={post.id}
                postContent={post.content}
                postCreatedAt={post.createdAt}
                videoTitle={post.videoTitle}
                onVideoClick={
                  post.videoInternalId
                    ? () => handleVideoClick(post.videoInternalId!)
                    : undefined
                }
              />
            ))}
        </div>
      </AppMain>
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleMonthSelect}
        selectedDate={dayjs(selectedMonth).toDate()}
        view="year"
      />
    </>
  );
};

export default AnalysisPage;
