import type { Property, PropertyMedia } from "@/lib/transparency/types";

export function isImageMedia(item: PropertyMedia): boolean {
  return item.media_type !== "video";
}

export function getHeroImageUrl(
  property: Property,
  media: PropertyMedia[],
): string | null {
  if (property.cover_image_url?.trim()) {
    return property.cover_image_url;
  }

  const firstPhoto = media.find(isImageMedia);
  return firstPhoto?.url ?? null;
}
