import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { parseVideoSource } from "@/utils/video";

interface VideoShowcaseProps {
    videoUrl: string;
    title: string;
    subtitle?: string;
    thumbnailUrl?: string;
}

/**
 * Pemutar video Beranda. Menampilkan thumbnail + tombol putar; video baru dimuat
 * (iframe YouTube / elemen <video>) setelah pengunjung menekan tombol putar,
 * sehingga halaman tetap ringan.
 */
export function VideoShowcase({ videoUrl, title, subtitle, thumbnailUrl }: VideoShowcaseProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [thumbBroken, setThumbBroken] = useState(false);

    const source = parseVideoSource(videoUrl);
    if (!source) return null;

    const poster =
        !thumbBroken && (thumbnailUrl || (source.kind === "youtube" ? source.thumbnailUrl : ""));

    const handlePlay = () => {
        if (source.kind === "external") {
            window.open(source.url, "_blank", "noopener,noreferrer");
            return;
        }
        setIsPlaying(true);
    };

    return (
        <div className="max-w-5xl mx-auto aspect-video bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden group border border-amber-500/20">
            {isPlaying && source.kind === "youtube" && (
                <iframe
                    src={source.embedUrl}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            )}

            {isPlaying && source.kind === "file" && (
                <video
                    src={source.url}
                    poster={poster || undefined}
                    className="absolute inset-0 w-full h-full bg-black"
                    controls
                    autoPlay
                    playsInline
                />
            )}

            {!isPlaying && (
                <>
                    {poster ? (
                        <img
                            src={poster}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            onError={() => setThumbBroken(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-primary/30" />
                    )}

                    <MediaWatermark size="lg" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handlePlay}
                            aria-label={`Putar video: ${title}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-[0_0_40px_rgba(225,29,72,0.5)] border border-white/30"
                        >
                            {source.kind === "external" ? (
                                <ExternalLink className="w-6 h-6 md:w-9 md:h-9 text-white" />
                            ) : (
                                <Play className="w-6 h-6 md:w-10 md:h-10 text-white fill-white ml-1 md:ml-2" />
                            )}
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-left pointer-events-none">
                        <p className="text-base sm:text-lg md:text-xl font-bold font-heading text-white line-clamp-1">{title}</p>
                        {subtitle && <p className="text-xs md:text-sm text-slate-300 mt-1">{subtitle}</p>}
                    </div>
                </>
            )}
        </div>
    );
}