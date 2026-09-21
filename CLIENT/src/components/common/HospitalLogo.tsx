import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store";

interface HospitalLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  isLink?: boolean;
  className?: string;
  textClassName?: string;
  subtextClassName?: string;
}

const sizeMap = {
  xs: "w-7 h-9",
  sm: "w-10 h-12",
  md: "w-13 h-15",
  lg: "w-16 h-18",
  xl: "w-24 h-26",
};

export function HospitalLogo({
  size = "md",
  showText = true,
  isLink = true,
  className = "",
  textClassName = "",
  subtextClassName = "",
}: HospitalLogoProps) {
  const { settings } = useStore();

  const logoContent = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem in pristine CIRCLE shape with luxury golden/emerald aura */}
      <div
        className={`relative flex items-center justify-center rounded-full bg-white p-1.5 shadow-md border-2 border-amber-300/90 ring-2 ring-primary/20 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:border-primary shrink-0 aspect-square ${sizeMap[size]}`}
      >
        <img
          src="/logo-sayang-ibu-sm.png"
          alt={settings.hospitalName || "RSIA Sayang Ibu"}
          className="w-full h-full object-cover rounded-full"
          loading="eager"
          decoding="async"
          width="48"
          height="50"
          onError={(e) => {
            // Fallback to logo.png if needed
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-heading font-bold text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors ${size === "xs"
              ? "text-sm"
              : size === "sm"
                ? "text-base"
                : size === "lg"
                  ? "text-2xl"
                  : size === "xl"
                    ? "text-3xl"
                    : "text-lg md:text-xl"
              } ${textClassName}`}
          >
            {settings.hospitalName || "RSIA Sayang Ibu"}
          </span>
          <span
            className={`text-[0.65rem] font-semibold text-amber-700 tracking-widest uppercase mt-0.5 flex items-center gap-1.5 ${subtextClassName}`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Batusangkar • Tanah Datar
          </span>
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" aria-label={settings.hospitalName || "RSIA Sayang Ibu"}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
