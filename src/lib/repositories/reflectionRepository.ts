import { getDB } from '../db';

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
    throw error;
  }
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

  // 動画が存在するか確認
  const videoResult = await db.query(
    'SELECT id FROM videos WHERE id = ? LIMIT 1',
    [videoId],
  );
  if (!videoResult.values || videoResult.values.length === 0) {
    throw new Error(`Video with id ${videoId} does not exist`);
  }

  await db.run(
    'INSERT INTO posts (id, videoId, contents, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    [postId, videoId, contents, now, now],
  );

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

  const result = await db.run(
    'UPDATE posts SET contents = ?, updatedAt = ? WHERE id = ?',
    [contents, Date.now(), postId],
  );

  if (result.changes?.changes === 0) {
    throw new Error(`Post with id ${postId} does not exist`);
  }
};

/**
 * 振り返り投稿を削除（動画は残る）
 */
export const deleteReflection = async (postId: string): Promise<void> => {
  const db = getDB();

  const result = await db.run('DELETE FROM posts WHERE id = ?', [postId]);

  if (result.changes?.changes === 0) {
    throw new Error(`Post with id ${postId} does not exist`);
  }
};

/**
 * 日付で動画と投稿をまとめて取得（投稿0件の動画も含む）
 */
export const getVideosByDate = async (
  date: string,
): Promise<VideoWithPosts[]> => {
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
};
