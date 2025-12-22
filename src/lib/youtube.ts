/**
 * YouTubeのURLからvideoIdを抽出
 * @param url YouTube URL (例: https://www.youtube.com/watch?v=xxx, https://youtu.be/xxx)
 * @returns videoId または null
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // youtube.com/watch?v=xxx
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }

    // youtu.be/xxx
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
};
