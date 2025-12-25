import { useState } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { VideoCard } from '@/features/VideoCard';
import { useDeleteVideoMutation } from '@/hooks/queries/useDeleteVideoMutation';
import { useUpdateVideoTitleMutation } from '@/hooks/queries/useUpdateVideoTitleMutation';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';
import styles from './VideoPage.module.scss';

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useVideoQuery(videoId || '');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateTitleMutation = useUpdateVideoTitleMutation(videoId || '');
  const deleteVideoMutation = useDeleteVideoMutation();

  if (!videoId) {
    return (
      <>
        <AppHeader showBackButton />
        <AppMain>
          <ErrorState message="動画IDが見つかりません" />
        </AppMain>
      </>
    );
  }

  // DBのタイトルをそのまま表示（YouTube API呼び出し不要）
  const displayTitle =
    video && video.title !== '' ? video.title : video?.videoId || '';

  const handleEditTitle = () => {
    setShowMenu(false);
    setEditedTitle(displayTitle);
    setIsEditingTitle(true);
  };

  const handleBlurTitle = () => {
    if (editedTitle.trim() && editedTitle !== displayTitle) {
      updateTitleMutation.mutate(editedTitle);
    }
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlurTitle();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditedTitle('');
    }
  };

  const handleDeleteVideo = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteVideo = () => {
    if (videoId) {
      deleteVideoMutation.mutate(videoId, {
        onSuccess: () => {
          // DailyPageに戻る
          if (video?.date) {
            navigate(`/daily/${video.date}`);
          } else {
            navigate('/');
          }
        },
      });
    }
  };

  return (
    <>
      <AppHeader
        subtitle={displayTitle}
        showBackButton
        actionButton={
          !isEditingTitle ? (
            <div style={{ position: 'relative' }}>
              <IconButton
                icon={<IoEllipsisVertical />}
                onClick={() => setShowMenu(!showMenu)}
                ariaLabel="メニュー"
              />
              {showMenu && (
                <div className={styles.menu}>
                  <button type="button" onClick={handleEditTitle}>
                    タイトルを編集
                  </button>
                  <button type="button" onClick={handleDeleteVideo}>
                    動画を削除
                  </button>
                </div>
              )}
            </div>
          ) : undefined
        }
      />
      <AppMain>
        {isEditingTitle && (
          <div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleBlurTitle}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
              }}
            />
          </div>
        )}
        {isLoading && <LoadingState />}
        {error && (
          <ErrorState
            message="動画の読み込みに失敗しました"
            onRetry={refetch}
          />
        )}
        {!isLoading && !error && video && (
          <VideoCard id={videoId} videoId={video.videoId} />
        )}
      </AppMain>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="動画を削除"
        message="この動画を削除しますか？関連する投稿もすべて削除されます。"
        onConfirm={confirmDeleteVideo}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default VideoPage;
