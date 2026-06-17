"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { VideoPlayer } from "@/components/transparency/video-player";
import { isImageMediaType } from "@/lib/admin/property-constants";
import { cn } from "@/lib/utils";
import type { PropertyMedia } from "@/lib/transparency/types";

interface MediaGalleryProps {
  media: PropertyMedia[];
}

function isVideo(item: PropertyMedia): boolean {
  return item.media_type === "video";
}

function isPhoto(item: PropertyMedia): boolean {
  return isImageMediaType(item.media_type);
}

function MediaMeta({ item }: { item: PropertyMedia }) {
  if (!item.caption && !item.phase && !item.room) {
    return null;
  }

  return (
    <div className="space-y-1 text-sm">
      {item.caption && (
        <p className="font-medium text-[#0F172A]">{item.caption}</p>
      )}
      {(item.phase || item.room) && (
        <p className="text-[#64748B]">
          {[item.phase, item.room].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

function GalleryVideo({ item }: { item: PropertyMedia }) {
  return (
    <div className="min-w-0 space-y-2">
      <VideoPlayer item={item} />
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

  if (photos.length === 1) {
    return (
      <div className="space-y-3">
        <div className="relative h-[280px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] sm:h-[360px] lg:h-[420px]">
          <Image
            src={activePhoto.url}
            alt={activePhoto.caption ?? "Foto do imóvel"}
            fill
            className="object-cover"
            sizes="(max-width: 1240px) 100vw, 1240px"
          />
        </div>
        <MediaMeta item={activePhoto} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[240px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] sm:h-[320px] lg:h-[380px]">
        <Image
          src={activePhoto.url}
          alt={activePhoto.caption ?? "Foto do imóvel"}
          fill
          className="object-cover"
          sizes="(max-width: 1240px) 100vw, 1240px"
        />
      </div>

      <MediaMeta item={activePhoto} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((item) => {
          const isActive = item.id === activePhoto.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[12px] border transition-all",
                isActive
                  ? "border-[#39AFF2] ring-2 ring-[#39AFF2]/20"
                  : "border-[#E2E8F0] hover:border-[#39AFF2]/40 hover:shadow-sm",
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
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
            Fotos e vídeos do projeto
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Registros visuais capturados pela equipe Checkmate durante a
            execução do projeto.
          </p>
        </div>
        <p className="text-sm text-[#64748B]">
          Nenhuma mídia publicada ainda.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
          Fotos e vídeos do projeto
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Registros visuais capturados pela equipe Checkmate durante a
          execução do projeto.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {videos.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">
              Vídeos
            </h3>
            <div className="space-y-5 sm:space-y-6">
              {videos.map((item) => (
                <GalleryVideo key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {videos.length > 0 && (
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">
                Fotos
              </h3>
            )}
            <PhotoGallery photos={photos} />
          </div>
        )}
      </div>
    </section>
  );
}
