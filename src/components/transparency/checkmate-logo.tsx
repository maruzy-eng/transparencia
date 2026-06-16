import Image from "next/image";

import type { TransparencySiteSettings } from "@/lib/transparency/settings-types";

interface CheckmateLogoProps {
  className?: string;
  compact?: boolean;
  settings?: Pick<
    TransparencySiteSettings,
    "portalName" | "logoUrl" | "logoCompactUrl"
  >;
}

export function CheckmateLogo({
  className,
  compact = false,
  settings,
}: CheckmateLogoProps) {
  const logoUrl = compact
    ? settings?.logoCompactUrl || settings?.logoUrl
    : settings?.logoUrl;
  const portalName = settings?.portalName ?? "CHECKMATE PROPERTY";

  if (logoUrl) {
    return (
      <div className={className}>
        <Image
          src={logoUrl}
          alt={portalName}
          width={compact ? 120 : 160}
          height={compact ? 32 : 40}
          className="h-auto w-auto max-h-10 object-contain"
          priority={!compact}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <svg
          width={compact ? 28 : 34}
          height={compact ? 28 : 34}
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M17 3L30 10V24L17 31L4 24V10L17 3Z"
            fill="url(#checkmate-logo-gradient)"
            fillOpacity="0.18"
          />
          <path
            d="M17 7L25 11.5V22.5L17 27L9 22.5V11.5L17 7Z"
            stroke="url(#checkmate-logo-gradient)"
            strokeWidth="1.5"
          />
          <path
            d="M13 17L16 20L22 14"
            stroke="#39AFF2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient
              id="checkmate-logo-gradient"
              x1="4"
              y1="3"
              x2="30"
              y2="31"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#53BC76" />
              <stop offset="0.5" stopColor="#2EC7A6" />
              <stop offset="1" stopColor="#39AFF2" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className={
            compact
              ? "text-[11px] font-bold tracking-[0.16em] text-[#0F172A]"
              : "text-[14px] font-bold tracking-[0.18em] text-[#0F172A]"
          }
        >
          {portalName.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
