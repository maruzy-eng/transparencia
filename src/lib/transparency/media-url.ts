const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function getYoutubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match?.[1]) return null;
  return `https://player.vimeo.com/video/${match[1]}`;
}

export function isDirectVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    if (path.includes("/property-media/")) {
      return true;
    }

    return DIRECT_VIDEO_EXTENSIONS.test(path);
  } catch {
    return DIRECT_VIDEO_EXTENSIONS.test(url);
  }
}

export type VideoEmbedKind = "youtube" | "vimeo" | "direct" | "external";

export function getVideoEmbedKind(url: string): VideoEmbedKind {
  if (getYoutubeEmbedUrl(url)) return "youtube";
  if (getVimeoEmbedUrl(url)) return "vimeo";
  if (isDirectVideoUrl(url)) return "direct";
  return "external";
}
