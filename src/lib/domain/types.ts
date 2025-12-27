export interface Post {
  id: string;
  content: string;
}

// 自己分析ページで扱う投稿の詳細情報
export interface PostDetail {
  id: string;
  content: string;
  createdAt: number;
  videoInternalId: string; // DB内の動画ID（VideoPageへの遷移用）
  videoId: string; // YouTubeのvideoId
  videoTitle: string;
  videoDate: string;
}

// DailyPageで扱う軽量なメタデータ
export interface VideoSummary {
  id: string;
  videoId: string;
  title: string;
}

// VideoCardで扱う動画と投稿の集約
export interface Video {
  id: string;
  videoId: string;
  title: string;
  date: string;
  posts: Post[];
}
