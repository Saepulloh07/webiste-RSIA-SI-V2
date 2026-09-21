import React, { useState } from "react";
import { MediaWatermark } from "./MediaWatermark";

interface WatermarkedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermarkSize?: "xs" | "sm" | "md" | "lg" | "xl";
  showWatermark?: boolean;
  watermarkClassName?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export function WatermarkedImage({
  src,
  alt = "",
  watermarkSize = "md",
  showWatermark = true,
  watermarkClassName = "",
  containerClassName = "",
  className = "",
  aspectRatio,
  ...props
}: WatermarkedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Default fallback image if source fails
  const fallbackSrc = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=75&auto=format&fit=crop";

  return (
    <div
      className={`relative overflow-hidden group select-none ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton / Low-overhead shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-100/80 animate-pulse" />
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-102"
        } ${className}`}
        {...props}
      />

      {/* Proportional Hospital Logo Watermark on Top Right */}
      {showWatermark && (
        <MediaWatermark
          size={watermarkSize}
          className={watermarkClassName}
        />
      )}
    </div>
  );
}
