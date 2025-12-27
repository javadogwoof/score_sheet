import type { capSQLiteChanges } from '@capacitor-community/sqlite';
import { getDB } from '../db';
import type { PostDetail, Video, VideoSummary } from '../domain/types';
import { NotFoundError, RetryableError } from '../errors';
import { retryWithBackoff } from '../retry';

// Internal DB DTOs
interface VideoDTO {
  id: string;
  videoId: string;
  date: string;
  createdAt: number;
  title: string;
}

interface InsightDTO {
  id: string;
  videoId: string | null;
  date: string | null;
  content: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 動画と最初の振り返り投稿を同時作成（トランザクション）
 */
export const postVideo = async (
  videoId: string,
  youtubeVideoId: string,
  date: string,
  title: string,
): Promise<{ videoId: string; postId: string }> => {
  return await retryWithBackoff(async () => {
    const db = getDB();
    const now = Date.now();
    const postId = crypto.randomUUID();

    await db.beginTransaction();

    try {
      // 動画を作成（transaction: falseを指定してbeginTransaction/commitで制御）
      await db.run(
        'INSERT INTO videos (id, videoId, date, createdAt, title) VALUES (?, ?, ?, ?, ?)',
        [videoId, youtubeVideoId, date, now, title],
        false,
      );

      await db.commitTransaction();

      return { videoId, postId };
    } catch (_error) {
      await db.rollbackTransaction();
      throw new RetryableError('Failed to create video');
    }
  });
};

/**
 * 既存動画に振り返り投稿を追加
 */
export const addInsightToVideo = async (
  videoId: string,
  content: string,
): Promise<string> => {
  const db = getDB();
  const now = Date.now();
  const insightId = crypto.randomUUID();

  // 動画が存在するか確認（ドメイン制約チェック、リトライ不要）
  const videoResult = await retryWithBackoff(() =>
    db.query('SELECT id FROM videos WHERE id = ? LIMIT 1', [videoId]),
  );
  if (!videoResult.values || videoResult.values.length === 0) {
    throw new NotFoundError('Video', videoId);
  }

  // 投稿を追加（DB操作、リトライ可能）
  try {
    await retryWithBackoff(() =>
      db.run(
        'INSERT INTO insights (id, videoId, date, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [insightId, videoId, null, content, now, now],
      ),
    );
  } catch (_error) {
    throw new RetryableError('Failed to add insight to video');
  }

  return insightId;
};

/**
 * 動画と紐づかない単体の投稿を追加
 */
export const addStandaloneInsight = async (
  date: string,
  content: string,
): Promise<string> => {
  const db = getDB();
  const now = Date.now();
  const insightId = crypto.randomUUID();

  try {
    await retryWithBackoff(() =>
      db.run(
        'INSERT INTO insights (id, videoId, date, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [insightId, null, date, content, now, now],
      ),
    );
  } catch (_error) {
    throw new RetryableError('Failed to add standalone insight');
  }

  return insightId;
};

/**
 * 振り返り投稿の内容を更新
 */
export const updateInsight = async (
  insightId: string,
  content: string,
): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('UPDATE insights SET content = ?, updatedAt = ? WHERE id = ?', [
        content,
        Date.now(),
        insightId,
      ]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to update insight');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Insight', insightId);
  }
};

/**
 * 振り返り投稿を削除（動画は残る）
 */
export const deleteInsight = async (insightId: string): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('DELETE FROM insights WHERE id = ?', [insightId]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to delete insight');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Insight', insightId);
  }
};

/**
 * 日付で動画のメタデータのみ取得（軽量）
 */
export const getVideosByDate = async (
  date: string,
): Promise<VideoSummary[]> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      // 動画メタデータのみ取得（投稿は取得しない）
      const videosResult = await db.query(
        'SELECT * FROM videos WHERE date = ? ORDER BY createdAt ASC',
        [date],
      );

      const videos = (videosResult.values || []) as VideoDTO[];

      return videos.map((video) => ({
        id: video.id,
        youtubeVideoId: video.videoId,
        title: video.title,
      }));
    });
  } catch (_error) {
    throw new RetryableError('Failed to get videos by date');
  }
};

/**
 * IDで動画と投稿の集約を取得
 */
export const getVideoById = async (id: string): Promise<Video> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      // 動画を取得
      const videoResult = await db.query(
        'SELECT * FROM videos WHERE id = ? LIMIT 1',
        [id],
      );

      const videos = (videoResult.values || []) as VideoDTO[];
      if (videos.length === 0) {
        throw new NotFoundError('Video', id);
      }

      const video = videos[0];

      // 投稿を取得
      const insightsResult = await db.query(
        'SELECT * FROM insights WHERE videoId = ? ORDER BY createdAt ASC',
        [id],
      );

      const insights = (insightsResult.values || []) as InsightDTO[];

      return {
        id: video.id,
        youtubeVideoId: video.videoId,
        title: video.title,
        date: video.date,
        posts: insights.map((insight) => ({
          id: insight.id,
          content: insight.content,
          videoId: insight.videoId ?? undefined,
          date: insight.date ?? undefined,
          createdAt: insight.createdAt,
          updatedAt: insight.updatedAt,
        })),
      };
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new RetryableError('Failed to get video by id');
  }
};

/**
 * 動画のタイトルを更新
 */
export const updateVideoTitle = async (
  videoId: string,
  title: string,
): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('UPDATE videos SET title = ? WHERE id = ?', [title, videoId]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to update video title');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Video', videoId);
  }
};

/**
 * 動画を削除（関連する投稿も自動削除される）
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('DELETE FROM videos WHERE id = ?', [videoId]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to delete video');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Video', videoId);
  }
};

/**
 * 指定月の投稿を動画情報と一緒に取得（新しい順）
 */
export const getPostsByMonth = async (
  yearMonth: string,
): Promise<PostDetail[]> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      // 投稿と動画情報をJOINして、指定月の投稿のみ取得
      const result = await db.query(
        `SELECT
          insights.id,
          insights.content,
          insights.createdAt,
          videos.id as videoInternalId,
          videos.videoId,
          videos.title as videoTitle,
          videos.date as videoDate
        FROM insights
        INNER JOIN videos ON insights.videoId = videos.id
        WHERE videos.date LIKE ?
        ORDER BY insights.createdAt DESC`,
        [`${yearMonth}%`],
      );

      const insights = (result.values || []) as Array<{
        id: string;
        content: string;
        createdAt: number;
        videoInternalId: string;
        videoId: string;
        videoTitle: string;
        videoDate: string;
      }>;

      return insights.map((insight) => ({
        id: insight.id,
        content: insight.content,
        createdAt: insight.createdAt,
        videoInternalId: insight.videoInternalId,
        youtubeVideoId: insight.videoId,
        videoTitle: insight.videoTitle,
        videoDate: insight.videoDate,
      }));
    });
  } catch (_error) {
    throw new RetryableError('Failed to get posts by month');
  }
};
