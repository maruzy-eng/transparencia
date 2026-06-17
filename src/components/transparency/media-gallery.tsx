"use client";

import { useMemo } from "react";
import Image from "next/image";

import { VideoPlayer } from "@/components/transparency/video-player";
import { isImageMedia } from "@/lib/transparency/media-helpers";
import type { PropertyMedia } from "@/lib/transparency/types";

interface MediaGalleryProps {
  media: PropertyMedia[];
}

function isVideo(item: PropertyMedia): boolean {
  return item.media_type === "video";
}

function MediaMeta({ item }: { item: PropertyMedia }) {
  if (!item.caption && !item.phase && !item.room) {
    return null;
  }

  return (
    <div className="space-y-1 px-1 pt-2 text-sm">
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
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC]"
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={item.thumbnail_url ?? item.url}
              alt={item.caption ?? "Foto do imóvel"}
              fill
              className="object-contain p-1"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <MediaMeta item={item} />
        </figure>
      ))}
    </div>
  );
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const { videos, photos } = useMemo(() => {
    const videos = media.filter(isVideo);
    const photos = media.filter(isImageMedia);

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
