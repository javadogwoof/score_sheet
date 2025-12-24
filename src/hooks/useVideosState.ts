import { useCallback, useRef, useState } from 'react';
import type { Video } from '@/lib/domain/types';
import { NotFoundError } from '@/lib/errors';
import {
  addReflectionToVideo,
  getVideosByDate,
} from '@/lib/repositories/reflectionRepository';

export const useVideosState = (date: string | undefined) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videosBackupRef = useRef<Video[]>([]);

  const loadVideos = useCallback(async () => {
    if (!date) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getVideosByDate(date);
      setVideos(data);
      videosBackupRef.current = data;
    } catch (_error) {
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [date]);

  const addPost = useCallback(
    async (videoId: string, content: string) => {
      if (!content) return;

      // バックアップを保存
      videosBackupRef.current = videos;

      // 楽観的更新：オンメモリで即座に更新
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                posts: [
                  ...v.posts,
                  {
                    id: crypto.randomUUID(),
                    content,
                  },
                ],
              }
            : v,
        ),
      );

      try {
        // サーバーに送信
        await addReflectionToVideo(videoId, content);
        // 成功時はバックアップをクリア
        videosBackupRef.current = [];
      } catch (err) {
        // エラー時：オンメモリ状態をロールバック
        setVideos(videosBackupRef.current);

        if (err instanceof NotFoundError) {
          setError('動画が見つかりません。ページを再読み込みしてください。');
        } else {
          setError('投稿の追加に失敗しました');
        }
      }
    },
    [videos],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    videos,
    loading,
    error,
    loadVideos,
    addPost,
    clearError,
  };
};
