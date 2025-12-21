import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';

/**
 * 動画を指定日付のふりかえりに追加するカスタムフック
 */
export function useAddVideoToDate() {
  const navigate = useNavigate();

  return async (date: string, videoId: string, options?: { shouldNavigate?: boolean }) => {
    // 動画を保存
    const savedVideoId = await storage.saveVideo({
      type: 'youtube',
      source: videoId,
    });

    // ふりかえりに動画を紐付け
    const retrospective = await storage.getRetrospective(date);
    const videos = retrospective?.videos || [];
    const memos = retrospective?.memos || [];

    // 動画がまだ追加されていない場合のみ追加
    if (!videos.find((v) => v.id === savedVideoId)) {
      videos.push({
        id: savedVideoId,
        type: 'youtube',
        source: videoId,
      });
    }

    await storage.saveRetrospective({
      date,
      videos,
      memos,
    });

    // オプション: ふりかえりページに遷移
    if (options?.shouldNavigate) {
      navigate(`/retrospective/${date}`);
    }
  };
}
