export interface Insight {
  id: string;
  content: string;
  videoId?: string;
  date?: string; // YYYY-MM-DD形式（動画と紐づかない投稿用）
  createdAt: number;
  updatedAt: number;
}

// 目標の優先度
export type GoalPriority = 'high' | 'medium' | 'low';

// 目標のステータス
export type GoalStatus = 'incomplete' | 'completed' | 'withdrawn';

// 目標
export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: GoalPriority;
  deadline: string; // YYYY-MM-DD形式
  status: GoalStatus;
  createdAt: number;
  updatedAt: number;
}

// 自己分析ページで扱う投稿の詳細情報
export interface PostDetail {
  id: string;
  content: string;
  createdAt: number;
  videoInternalId?: string; // DB内の動画ID（VideoPageへの遷移用）
  youtubeVideoId?: string; // YouTubeのvideoId
  videoTitle?: string;
  videoDate?: string;
}

// DailyPageで扱う軽量なメタデータ
export interface VideoSummary {
  id: string;
  youtubeVideoId: string;
  title: string;
}

// VideoCardで扱う動画と投稿の集約
export interface Video {
  id: string;
  youtubeVideoId: string;
  title: string;
  date: string;
  posts: Insight[];
}
