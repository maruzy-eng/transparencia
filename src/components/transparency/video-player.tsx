"use client";

import { useRef, useState } from "react";
import { Play, PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getVideoEmbedKind,
  getVimeoEmbedUrl,
  getYoutubeEmbedUrl,
  getYoutubeThumbnailUrl,
} from "@/lib/transparency/media-url";
import type { PropertyMedia } from "@/lib/transparency/types";

interface VideoPlayerProps {
  item: PropertyMedia;
  className?: string;
  variant?: "default" | "compact";
}

function PlayOverlayButton({
  onClick,
  compact,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Reproduzir vídeo"
      className="absolute inset-0 z-10 flex items-center justify-center bg-[#0F172A]/25 transition-colors hover:bg-[#0F172A]/35"
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-white/95 text-[#39AFF2] shadow-[0_8px_32px_rgba(15,23,42,0.2)] transition-transform hover:scale-105",
          compact ? "h-12 w-12" : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
        )}
      >
        <Play
          className={cn(
            "fill-current",
            compact ? "ml-0.5 h-5 w-5" : "ml-1 h-7 w-7 sm:h-8 sm:w-8",
          )}
        />
      </span>
    </button>
  );
}

export function VideoPlayer({
  item,
  className,
  variant = "default",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embedKind = getVideoEmbedKind(item.url);
  const youtubeEmbed = getYoutubeEmbedUrl(item.url);
  const vimeoEmbed = getVimeoEmbedUrl(item.url);
  const youtubeThumbnail = getYoutubeThumbnailUrl(item.url);
  const poster = item.thumbnail_url ?? youtubeThumbnail ?? undefined;

  const frameClassName = cn(
    "relative w-full max-w-full overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#0F172A]",
    variant === "default" && "h-[240px] sm:h-[320px] lg:h-[420px]",
    variant === "compact" && "h-48 max-h-48 rounded-none border-0",
  );

  const rootClassName = cn("w-full min-w-0 max-w-full overflow-hidden", className);

  function handlePlay() {
    setIsPlaying(true);
    if (embedKind === "direct") {
      requestAnimationFrame(() => {
        void videoRef.current?.play();
      });
    }
  }

  if (embedKind === "external") {
    return (
      <div className={rootClassName}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            frameClassName,
            "flex flex-col items-center justify-center bg-[#F8FAFC] text-[#64748B] transition-colors hover:text-[#0F172A]",
          )}
        >
          <PlayCircle className="h-14 w-14 text-[#39AFF2]" />
          <span className="mt-3 text-sm font-medium">Abrir vídeo</span>
        </a>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className={rootClassName}>
        <div className={frameClassName}>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={item.caption ?? "Prévia do vídeo"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : embedKind === "direct" ? (
            <video
              src={item.url}
              preload="metadata"
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A]" />
          )}
          <PlayOverlayButton onClick={handlePlay} compact={variant === "compact"} />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <div className={frameClassName}>
        {embedKind === "youtube" && youtubeEmbed ? (
          <iframe
            src={`${youtubeEmbed}?autoplay=1`}
            title={item.caption ?? "Vídeo do imóvel"}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embedKind === "vimeo" && vimeoEmbed ? (
          <iframe
            src={`${vimeoEmbed}?autoplay=1`}
            title={item.caption ?? "Vídeo do imóvel"}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={item.url}
            controls
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-contain"
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        )}
      </div>
    </div>
  );
}
