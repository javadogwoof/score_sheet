import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { AppMain } from '@/components/AppMain';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DropdownMenu, type MenuItem } from '@/components/DropdownMenu';
import { ErrorState } from '@/components/ErrorState';
import { InlineEdit } from '@/components/InlineEdit';
import { LoadingState } from '@/components/LoadingState';
import { VideoCard } from '@/features/VideoCard';
import { useDeleteVideoMutation } from '@/hooks/queries/useDeleteVideoMutation';
import { useUpdateVideoTitleMutation } from '@/hooks/queries/useUpdateVideoTitleMutation';
import { useVideoQuery } from '@/hooks/queries/useVideoQuery';

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
    setIsEditingTitle(true);
  };

  const handleSaveTitle = (newTitle: string) => {
    updateTitleMutation.mutate(newTitle);
    setIsEditingTitle(false);
  };

  const handleDeleteVideo = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteVideo = () => {
    if (videoId) {
      deleteVideoMutation.mutate(videoId, {
        onSuccess: () => navigate(-1),
      });
    }
  };

  // メニュー項目を定義
  const menuItems: MenuItem[] = [
    {
      label: 'タイトルを編集',
      onClick: handleEditTitle,
    },
    {
      label: '動画を削除',
      onClick: handleDeleteVideo,
    },
  ];

  return (
    <>
      <AppHeader
        subtitle={displayTitle}
        showBackButton
        actionButton={
          !isEditingTitle ? <DropdownMenu items={menuItems} /> : undefined
        }
      />
      <AppMain>
        {isEditingTitle && (
          <InlineEdit initialValue={displayTitle} onSave={handleSaveTitle} />
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
