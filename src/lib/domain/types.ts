export interface Post {
  id: string;
  content: string;
}

export interface Video {
  id: string;
  videoId: string;
  posts: Post[];
}
