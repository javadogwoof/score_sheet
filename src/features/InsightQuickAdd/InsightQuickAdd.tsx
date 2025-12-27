import { useState, useEffect, useRef } from 'react';
import { IoAdd, IoPlay, IoText } from 'react-icons/io5';
import { Card } from '@/components/Card';
import { PostModal, usePostModal } from '@/features/PostModal';
import styles from './InsightQuickAdd.module.scss';

interface InsightQuickAddProps {
  onAddVideo: (videoUrl: string) => void;
  onAddInsight: (content: string) => void;
}

type Mode = 'collapsed' | 'menu' | 'insight';

export const InsightQuickAdd = ({
  onAddVideo,
  onAddInsight,
}: InsightQuickAddProps) => {
  const [mode, setMode] = useState<Mode>('collapsed');
  const [insightContent, setInsightContent] = useState('');
  const { isOpen: isVideoModalOpen, open: openVideoModal, close: closeVideoModal } = usePostModal();
  const containerRef = useRef<HTMLDivElement>(null);

  // 外側タップでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        (mode === 'menu' || mode === 'insight')
      ) {
        setMode('collapsed');
        setInsightContent('');
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mode]);

  const handleToggle = () => {
    setMode(mode === 'collapsed' ? 'menu' : 'collapsed');
  };

  const handleSelectVideo = () => {
    setMode('collapsed');
    openVideoModal();
  };

  const handleSelectInsight = () => {
    setMode('insight');
  };

  const handleCancelInsight = () => {
    setMode('collapsed');
    setInsightContent('');
  };

  const handleSubmitInsight = () => {
    if (!insightContent.trim()) return;
    onAddInsight(insightContent.trim());
    setInsightContent('');
    setMode('collapsed');
  };

  const handleVideoSubmit = (videoUrl: string) => {
    onAddVideo(videoUrl);
    closeVideoModal();
  };

  return (
    <>
      <div ref={containerRef} className={styles.floatingContainer}>
        {mode === 'collapsed' && (
          <button
            type="button"
            onClick={handleToggle}
            className={styles.addButton}
            aria-label="追加"
          >
            <IoAdd className={styles.icon} />
          </button>
        )}

        {mode === 'menu' && (
          <Card className={styles.menuCard}>
            <button
              type="button"
              onClick={handleSelectVideo}
              className={styles.menuButton}
            >
              <IoPlay className={styles.menuIcon} />
              <span>動画を追加</span>
            </button>
            <button
              type="button"
              onClick={handleSelectInsight}
              className={styles.menuButton}
            >
              <IoText className={styles.menuIcon} />
              <span>気付きを投稿</span>
            </button>
            <button
              type="button"
              onClick={handleToggle}
              className={styles.closeButton}
            >
              閉じる
            </button>
          </Card>
        )}

        {mode === 'insight' && (
          <Card className={styles.insightCard}>
            <textarea
              className={styles.textarea}
              placeholder="今日の気付きを書き留めましょう..."
              value={insightContent}
              onChange={(e) => setInsightContent(e.target.value)}
              rows={6}
              autoFocus
            />
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleCancelInsight}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSubmitInsight}
                disabled={!insightContent.trim()}
                className={styles.submitButton}
              >
                投稿
              </button>
            </div>
          </Card>
        )}
      </div>

      <PostModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        onSubmit={handleVideoSubmit}
      />
    </>
  );
};
