import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { storage } from "@/lib/storage";
import type { Retrospective } from "@/lib/storage";
import styles from "./RetrospectivePage.module.scss";

const RetrospectivePage = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Retrospective | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
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
    };
    loadData();
  }, [date]);

  const handleBack = () => {
    navigate("/");
  };

  const handleSaveMemo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) return;

    const formData = new FormData(e.currentTarget);
    const content = formData.get('memo') as string;

    try {
      await storage.saveMemo({
        date,
        content,
      });
      alert('保存しました');
    } catch (error) {
      console.error('Failed to save memo:', error);
      alert('保存に失敗しました');
    }
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

      {data?.videos && data.videos.length > 0 && (
        <div className={styles.videoSection}>
          {data.videos.map((video) => (
            <div key={video.id} className={styles.videoWrapper}>
              {video.type === 'youtube' && (
                <YouTubePlayer videoId={video.source} />
              )}
              {video.type === 'local' && (
                <div>ローカル動画: {video.title || video.source}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSaveMemo}>
        <label className={styles.label} htmlFor="memo">
          メモ
        </label>
        <textarea
          className={styles.memo}
          id="memo"
          name="memo"
          defaultValue={data?.memos[0]?.content || ""}
          placeholder="ふりかえりのメモを入力..."
        />
        <button type="submit" className={styles.saveButton}>
          保存
        </button>
      </form>
    </div>
  );
};

export default RetrospectivePage;
