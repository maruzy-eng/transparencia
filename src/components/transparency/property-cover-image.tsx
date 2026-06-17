"use client";

import { useState } from "react";
import Image from "next/image";
import { Home } from "lucide-react";

import { cn } from "@/lib/utils";

interface PropertyCoverImageProps {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}

export function PropertyCoverImage({
  src,
  alt,
  priority = false,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 400px",
}: PropertyCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#EEF9F3_0%,#F0F9FF_100%)] text-[#64748B]",
          className,
        )}
      >
        <Home className="h-8 w-8 text-[#39AFF2]/70" />
        <span className="text-xs font-medium">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
