import type { capSQLiteChanges } from '@capacitor-community/sqlite';
import { getDB } from '../db';
import type { Video } from '../domain/types';
import { NotFoundError, RetryableError } from '../errors';
import { retryWithBackoff } from '../retry';

// Internal DB DTOs
interface VideoDTO {
  id: string;
  videoId: string;
  date: string;
  createdAt: number;
}

interface PostDTO {
  id: string;
  videoId: string;
  contents: string;
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
): Promise<{ videoId: string; postId: string }> => {
  return await retryWithBackoff(async () => {
    const db = getDB();
    const now = Date.now();
    const postId = crypto.randomUUID();

    await db.beginTransaction();

    try {
      // 動画を作成（transaction: falseを指定してbeginTransaction/commitで制御）
      await db.run(
        'INSERT INTO videos (id, videoId, date, createdAt) VALUES (?, ?, ?, ?)',
        [videoId, youtubeVideoId, date, now],
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
export const addReflectionToVideo = async (
  videoId: string,
  contents: string,
): Promise<string> => {
  const db = getDB();
  const now = Date.now();
  const postId = crypto.randomUUID();

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
        'INSERT INTO posts (id, videoId, contents, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [postId, videoId, contents, now, now],
      ),
    );
  } catch (_error) {
    throw new RetryableError('Failed to add reflection to video');
  }

  return postId;
};

/**
 * 振り返り投稿の内容を更新
 */
export const updateReflection = async (
  postId: string,
  contents: string,
): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('UPDATE posts SET contents = ?, updatedAt = ? WHERE id = ?', [
        contents,
        Date.now(),
        postId,
      ]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to update reflection');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Post', postId);
  }
};

/**
 * 振り返り投稿を削除（動画は残る）
 */
export const deleteReflection = async (postId: string): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('DELETE FROM posts WHERE id = ?', [postId]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to delete reflection');
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Post', postId);
  }
};

/**
 * 日付で動画と投稿をまとめて取得（投稿0件の動画も含む）
 */
export const getVideosByDate = async (date: string): Promise<Video[]> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      // 動画を取得
      const videosResult = await db.query(
        'SELECT * FROM videos WHERE date = ? ORDER BY createdAt ASC',
        [date],
      );

      const videos = (videosResult.values || []) as VideoDTO[];

      // 各動画に紐づく投稿を取得し、ドメイン型に変換
      const domainVideos: Video[] = [];

      for (const video of videos) {
        const postsResult = await db.query(
          'SELECT * FROM posts WHERE videoId = ? ORDER BY createdAt ASC',
          [video.id],
        );

        const posts = (postsResult.values || []) as PostDTO[];

        domainVideos.push({
          id: video.id,
          videoId: video.videoId,
          posts: posts.map((post) => ({
            id: post.id,
            content: post.contents,
          })),
        });
      }

      return domainVideos;
    });
  } catch (_error) {
    throw new RetryableError('Failed to get videos by date');
  }
};
