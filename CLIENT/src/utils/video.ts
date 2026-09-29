/**
 * Utilitas untuk membaca URL video yang diatur admin lewat CMS.
 * Mendukung: YouTube (watch / youtu.be / embed / shorts / live), file video
 * langsung (.mp4, .webm, .ogg, .mov, .m4v), dan tautan http(s) lain (dibuka di tab baru).
 */
export type VideoSource =
    | { kind: "youtube"; id: string; embedUrl: string; thumbnailUrl: string }
    | { kind: "file"; url: string }
    | { kind: "external"; url: string };

const YOUTUBE_HOSTS = new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "youtu.be",
]);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const FILE_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

export function parseVideoSource(rawUrl?: string | null): VideoSource | null {
    const value = (rawUrl || "").trim();
    if (!value) return null;

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        return null;
    }
    // Hanya izinkan http(s) — mencegah skema berbahaya seperti javascript:
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    const host = url.hostname.toLowerCase();

    if (YOUTUBE_HOSTS.has(host)) {
        let id: string | null = null;
        if (host === "youtu.be") {
            id = url.pathname.split("/").filter(Boolean)[0] || null;
        } else {
            id = url.searchParams.get("v");
            if (!id) {
                const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
                if (m) id = m[1];
            }
        }
        if (id && YOUTUBE_ID.test(id)) {
            return {
                kind: "youtube",
                id,
                embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
                thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            };
        }
        // Tautan channel/playlist tanpa ID video: tidak bisa di-embed
        return { kind: "external", url: url.toString() };
    }

    if (FILE_EXT.test(url.pathname)) {
        return { kind: "file", url: url.toString() };
    }

    return { kind: "external", url: url.toString() };
}