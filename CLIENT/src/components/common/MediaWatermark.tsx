import React from "react";

interface MediaWatermarkProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  badge?: boolean;
}

const watermarkSizes = {
  xs: "w-5 h-7",
  sm: "w-7 h-9",
  md: "w-9 h-11",
  lg: "w-12 h-14",
  xl: "w-16 h-18",
};

const badgePadding = {
  xs: "p-0.5 rounded-full aspect-square",
  sm: "p-1 rounded-full aspect-square",
  md: "p-1.5 rounded-full aspect-square",
  lg: "p-2 rounded-full aspect-square",
  xl: "p-2.5 rounded-full aspect-square",
};

export function MediaWatermark({
  size = "md",
  className = "",
  badge = true,
}: MediaWatermarkProps) {
  return (
    <div
      className={`absolute top-2.5 right-2.5 z-20 pointer-events-none transition-transform duration-300 group-hover:scale-105 ${className}`}
      title="RSIA Sayang Ibu"
    >
      {badge ? (
        <div
          className={`bg-white/95 backdrop-blur-md shadow-md border-2 border-amber-300/90 rounded-full flex items-center justify-center ring-2 ring-primary/20 ${badgePadding[size]}`}
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(212, 175, 55, 0.2)",
          }}
        >
          <img
            src="/logo-sayang-ibu-sm.png"
            alt="Logo RSIA Sayang Ibu"
            className={`${watermarkSizes[size]} object-cover rounded-full`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />
        </div>
      ) : (
        <img
          src="/logo-sayang-ibu-sm.png"
          alt="Logo RSIA Sayang Ibu"
          className={`${watermarkSizes[size]} object-cover rounded-full drop-shadow-md border border-amber-200`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />
      )}
    </div>
  );
}
