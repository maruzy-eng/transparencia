import type { Property, PropertyMedia } from "@/lib/transparency/types";

export function isImageMedia(item: PropertyMedia): boolean {
  return item.media_type !== "video";
}

export function findFirstRegisteredImage(
  media: PropertyMedia[],
): PropertyMedia | undefined {
  return [...media]
    .filter(isImageMedia)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
}

export function getPropertyListingCoverUrl(
  property: Property,
  firstRegisteredImageUrl?: string | null,
): string | null {
  if (property.cover_image_url?.trim()) {
    return property.cover_image_url;
  }

  return firstRegisteredImageUrl ?? null;
}

export function getHeroImageUrl(
  property: Property,
  media: PropertyMedia[],
): string | null {
  if (property.cover_image_url?.trim()) {
    return property.cover_image_url;
  }

  return findFirstRegisteredImage(media)?.url ?? null;
}
