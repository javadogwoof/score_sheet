import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoWithMemo } from "@/components/VideoWithMemo";
import { useVideoUrlModal } from "@/contexts/VideoUrlModalContext";
import { useAddVideoToDate } from "@/hooks/useAddVideoToDate";
import { storage } from "@/lib/storage";
import type { Retrospective } from "@/lib/storage";
import styles from "./RetrospectivePage.module.scss";

const RetrospectivePage = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { openModal } = useVideoUrlModal();
  const addVideoToDate = useAddVideoToDate();
  const [data, setData] = useState<Retrospective | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const retrospective = await storage.getRetrospective(date);
      setData(retrospective);
    } catch (error) {
      console.error('Failed to load retrospective:', error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => {
    navigate("/");
  };

  const handleSaveMemo = async (videoId: number, content: string) => {
    if (!date) return;

    try {
      await storage.saveMemo({
        date,
        content,
        video_id: videoId,
      });

      // データを再読み込み
      await loadData();
    } catch (error) {
      console.error('Failed to save memo:', error);
      throw error;
    }
  };

  const handleDeletePost = async (videoId: number) => {
    if (!date) return;

    try {
      await storage.deletePost(date, videoId);

      // データを再読み込み
      await loadData();
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  const handleAddVideo = () => {
    if (!date) return;

    openModal(async (videoId: string) => {
      try {
        await addVideoToDate(date, videoId);
        await loadData();
      } catch (error) {
        console.error('Failed to save video:', error);
        alert('動画の保存に失敗しました');
      }
    });
  };

  if (loading) {
    return <div className={styles.container}>読み込み中...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← カレンダーに戻る
        </button>
        <h2 className={styles.date}>{date}</h2>
      </div>

      {data?.videos && data.videos.length > 0 ? (
        <div className={styles.videosSection}>
          {data.videos.map((video) => {
            // この動画に紐づくメモを探す
            const memo = data.memos.find((m) => m.video_id === video.id);

            return (
              <VideoWithMemo
                key={video.id}
                video={video}
                memo={memo}
                onSaveMemo={(content) => handleSaveMemo(video.id!, content)}
                onDelete={() => handleDeletePost(video.id!)}
              />
            );
          })}

          <button className={styles.addVideoButton} onClick={handleAddVideo}>
            ＋ 動画を追加
          </button>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>まだ動画が追加されていません</p>
          <button className={styles.addVideoButtonPrimary} onClick={handleAddVideo}>
            ＋ 動画を追加
          </button>
        </div>
      )}
    </div>
  );
};

export default RetrospectivePage;
