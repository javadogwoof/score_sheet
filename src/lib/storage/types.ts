/**
 * データモデルの型定義
 */

export interface Video {
  id?: number;
  type: 'youtube' | 'local';
  source: string; // YouTube video ID or local video URI
  title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Memo {
  id?: number;
  video_id?: number;
  date: string; // YYYY-MM-DD format
  content: string;
  timestamp?: number; // Video timestamp in seconds (optional)
  created_at?: string;
  updated_at?: string;
}

export interface Retrospective {
  id?: number;
  video_id?: number;
  date: string; // YYYY-MM-DD format
  videos: Video[];
  memos: Memo[];
}

/**
 * ストレージの抽象インターフェース
 * 実装（SQLite, IndexedDB, localStorage など）を交換可能にする
 */
export interface StorageAdapter {
  /**
   * 初期化
   */
  initialize(): Promise<void>;

  /**
   * 指定日付のふりかえりデータを取得
   */
  getRetrospective(date: string): Promise<Retrospective | null>;

  /**
   * ふりかえりデータを保存
   */
  saveRetrospective(retrospective: Retrospective): Promise<void>;

  /**
   * メモを保存
   */
  saveMemo(memo: Memo): Promise<void>;

  /**
   * 動画を保存
   */
  saveVideo(video: Video): Promise<number>; // returns video id

  /**
   * 指定日付の動画一覧を取得
   */
  getVideosByDate(date: string): Promise<Video[]>;

  /**
   * 指定日付のメモ一覧を取得
   */
  getMemosByDate(date: string): Promise<Memo[]>;

  /**
   * 投稿（動画とそれに紐づくメモ）を削除
   */
  deletePost(date: string, videoId: number): Promise<void>;
}
