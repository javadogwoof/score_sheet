import { useState } from 'react';
import { IoPencil } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';
import { VideoCard } from '@/features/VideoCard';
import { useUpdateVideoTitleMutation } from '@/hooks/queries/useUpdateVideoTitleMutation';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>();

  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useVideoQuery(videoId || '');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const updateTitleMutation = useUpdateVideoTitleMutation(videoId || '');

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
    setEditedTitle(displayTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateTitleMutation.mutate(editedTitle);
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  return (
    <>
      <AppHeader
        subtitle={displayTitle}
        showBackButton
        actionButton={
          !isEditingTitle ? (
            <IconButton
              icon={<IoPencil />}
              onClick={handleEditTitle}
              ariaLabel="タイトルを編集"
            />
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
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                fontSize: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleSaveTitle}
                disabled={!editedTitle.trim()}
                style={{ padding: '8px 16px' }}
              >
                保存
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ padding: '8px 16px' }}
              >
                キャンセル
              </button>
            </div>
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
    </>
  );
};

export default VideoPage;
