import { useQuery } from '@tanstack/react-query';

interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

const fetchYouTubeTitle = async (videoId: string): Promise<string> => {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube title');
  }

  const data: YouTubeOEmbedResponse = await response.json();
  return data.title;
};

export const useYouTubeTitleQuery = (videoId: string) => {
  return useQuery({
    queryKey: ['youtubeTitle', videoId],
    queryFn: () => fetchYouTubeTitle(videoId),
    staleTime: Number.POSITIVE_INFINITY, // タイトルは変わらないので永続的にキャッシュ
    retry: 1,
  });
};
