export interface Post {
  id: string;
  content: string;
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
  posts: Post[];
}
