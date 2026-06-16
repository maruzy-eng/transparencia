"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

import { EmptyState } from "@/components/transparency/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PropertyMedia } from "@/lib/transparency/types";

interface MediaGalleryProps {
  media: PropertyMedia[];
}

function isVideo(item: PropertyMedia): boolean {
  return item.media_type === "video";
}

function isPhoto(item: PropertyMedia): boolean {
  return item.media_type === "photo" || item.media_type === "image";
}

function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
}

function MediaMeta({ item }: { item: PropertyMedia }) {
  if (!item.caption && !item.phase && !item.room) {
    return null;
  }

  return (
    <div className="space-y-1 text-sm">
      {item.caption && <p>{item.caption}</p>}
      {(item.phase || item.room) && (
        <p className="text-muted-foreground">
          {[item.phase, item.room].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

function VideoPlayer({ item }: { item: PropertyMedia }) {
  const embedUrl = getYoutubeEmbedUrl(item.url);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={item.caption ?? "Vídeo do imóvel"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            <PlayCircle className="h-12 w-12" />
            <span>Abrir vídeo</span>
          </a>
        )}
      </div>
      <MediaMeta item={item} />
    </div>
  );
}

function PhotoGallery({ photos }: { photos: PropertyMedia[] }) {
  const [activeId, setActiveId] = useState(photos[0]?.id ?? null);
  const activePhoto =
    photos.find((item) => item.id === activeId) ?? photos[0];

  if (!activePhoto) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted">
        <Image
          src={activePhoto.url}
          alt={activePhoto.caption ?? "Foto do imóvel"}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 800px"
        />
      </div>

      <MediaMeta item={activePhoto} />

      {photos.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((item) => {
            const isActive = item.id === activePhoto.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border transition-all",
                  isActive
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-border/60 hover:border-amber-500/40",
                )}
              >
                <Image
                  src={item.thumbnail_url ?? item.url}
                  alt={item.caption ?? "Miniatura"}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const { videos, photos } = useMemo(() => {
    const videos = media.filter(isVideo);
    const photos = media.filter(isPhoto);

    return { videos, photos };
  }, [media]);

  if (videos.length === 0 && photos.length === 0) {
    return (
      <EmptyState
        title="Nenhuma mídia publicada"
        description="Fotos e vídeos deste imóvel aparecerão aqui quando forem publicados."
      />
    );
  }

  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {videos.map((item) => (
              <VideoPlayer key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Galeria de imagens</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoGallery photos={photos} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
