/**
 * YouTube URL関連のユーティリティ
 */

/**
 * YouTube URLからビデオIDを抽出
 * 対応フォーマット:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID (直接IDを入力した場合)
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // 空白を削除
  url = url.trim();

  // すでにビデオIDの形式の場合（11文字の英数字とアンダースコア、ハイフン）
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }

    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // 先頭の "/" を削除
      if (videoId) return videoId;
    }

    // youtube.com/embed/VIDEO_ID
    if (urlObj.pathname.includes('/embed/')) {
      const parts = urlObj.pathname.split('/');
      const videoId = parts[parts.indexOf('embed') + 1];
      if (videoId) return videoId;
    }
  } catch {
    // URLのパースに失敗した場合はnullを返す
    return null;
  }

  return null;
}

/**
 * ビデオIDの検証
 */
export function isValidYouTubeVideoId(videoId: string | null): boolean {
  if (!videoId) return false;
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}
