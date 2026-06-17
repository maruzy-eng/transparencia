import { PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getVideoEmbedKind,
  getVimeoEmbedUrl,
  getYoutubeEmbedUrl,
} from "@/lib/transparency/media-url";
import type { PropertyMedia } from "@/lib/transparency/types";

interface VideoPlayerProps {
  item: PropertyMedia;
  className?: string;
  variant?: "default" | "compact";
}

export function VideoPlayer({
  item,
  className,
  variant = "default",
}: VideoPlayerProps) {
  const embedKind = getVideoEmbedKind(item.url);
  const youtubeEmbed = getYoutubeEmbedUrl(item.url);
  const vimeoEmbed = getVimeoEmbedUrl(item.url);

  return (
    <div className={className}>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-black",
          variant === "compact" && "max-h-48 rounded-none border-0",
        )}
      >
        {embedKind === "youtube" && youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={item.caption ?? "Vídeo do imóvel"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embedKind === "vimeo" && vimeoEmbed ? (
          <iframe
            src={vimeoEmbed}
            title={item.caption ?? "Vídeo do imóvel"}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : embedKind === "direct" ? (
          <video
            src={item.url}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col items-center justify-center gap-3 bg-[#F8FAFC] text-[#64748B] transition-colors hover:text-[#0F172A]"
          >
            <PlayCircle className="h-14 w-14 text-[#39AFF2]" />
            <span className="text-sm font-medium">Abrir vídeo</span>
          </a>
        )}
      </div>
    </div>
  );
}
