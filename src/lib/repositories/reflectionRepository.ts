import type { capSQLiteChanges } from '@capacitor-community/sqlite';
import { getDB } from '../db';
import { NotFoundError, RetryableError } from '../errors';
import { retryWithBackoff } from '../retry';

export interface Video {
  id: string;
  videoId: string;
  date: string;
  createdAt: number;
}

export interface Post {
  id: string;
  videoId: string;
  contents: string;
  createdAt: number;
  updatedAt: number;
}

export interface VideoWithPosts {
  video: Video;
  posts: Post[];
}

/**
 * 動画と最初の振り返り投稿を同時作成（トランザクション）
 */
export const createVideoWithReflection = async (
  videoId: string,
  youtubeVideoId: string,
  date: string,
  initialContents: string,
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

      // 最初の投稿を作成
      await db.run(
        'INSERT INTO posts (id, videoId, contents, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [postId, videoId, initialContents, now, now],
        false,
      );

      await db.commitTransaction();

      return { videoId, postId };
    } catch (error) {
      await db.rollbackTransaction();
      throw new RetryableError('Failed to create video with reflection', error);
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
  } catch (error) {
    throw new RetryableError('Failed to add reflection to video', error);
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
  } catch (error) {
    throw new RetryableError('Failed to update reflection', error);
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
  } catch (error) {
    throw new RetryableError('Failed to delete reflection', error);
  }

  // リトライ後に存在チェック（リトライ不要なエラー）
  if (result.changes?.changes === 0) {
    throw new NotFoundError('Post', postId);
  }
};

/**
 * 日付で動画と投稿をまとめて取得（投稿0件の動画も含む）
 */
export const getVideosByDate = async (
  date: string,
): Promise<VideoWithPosts[]> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      // 動画を取得
      const videosResult = await db.query(
        'SELECT * FROM videos WHERE date = ? ORDER BY createdAt ASC',
        [date],
      );

      const videos = (videosResult.values || []) as Video[];

      // 各動画に紐づく投稿を取得
      const videosWithPosts: VideoWithPosts[] = [];

      for (const video of videos) {
        const postsResult = await db.query(
          'SELECT * FROM posts WHERE videoId = ? ORDER BY createdAt ASC',
          [video.id],
        );

        const posts = (postsResult.values || []) as Post[];

        videosWithPosts.push({
          video,
          posts,
        });
      }

      return videosWithPosts;
    });
  } catch (error) {
    throw new RetryableError('Failed to get videos by date', error);
  }
};
