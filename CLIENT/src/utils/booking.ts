/**
 * Utilitas Pendaftaran Online (booking SIMRS).
 * - normalisasi nomor telepon
 * - penyimpanan bukti pendaftaran di perangkat pasien (localStorage)
 * - pemetaan status server -> teks & warna yang ramah pasien
 */
import type { BookingStatus, QueueServiceStatus } from "@/app/api";

/* ------------------------------------------------------------------ */
/* Nomor telepon                                                       */
/* ------------------------------------------------------------------ */

/** Format lokal: 08xxxxxxxxxx. Menerima 08..., 628..., +628..., dan spasi/tanda hubung. */
export function normalizePhone(raw: string): string {
    let digits = (raw || "").replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) digits = digits.slice(1);
    if (digits.startsWith("62")) digits = "0" + digits.slice(2);
    else if (digits.startsWith("8")) digits = "0" + digits;
    return digits;
}

/** Nomor seluler Indonesia yang wajar: 08 + 8–12 digit. */
export function isValidIndonesianMobile(raw: string): boolean {
    return /^08\d{8,12}$/.test(normalizePhone(raw));
}

/**
 * Server mencocokkan nomor telepon secara persis, sementara data SIMRS bisa
 * tersimpan sebagai 08xxx atau 628xxx. Kembalikan varian yang perlu dicoba
 * (berurutan, maksimal 2 agar tidak menghabiskan rate limit 10 req/menit).
 */
export function phoneVariants(raw: string): string[] {
    const local = normalizePhone(raw);
    if (!local.startsWith("0")) return [local];
    return [local, "62" + local.slice(1)];
}

/** 0812****7890 — untuk menampilkan nomor tanpa membuka seluruh digit. */
export function maskPhone(raw: string): string {
    const p = normalizePhone(raw);
    if (p.length < 8) return p;
    return `${p.slice(0, 4)}****${p.slice(-3)}`;
}

/** "Siti Nurhaliza" -> "Si** Nu*******" (privasi saat pencarian manual). */
export function maskName(name: string): string {
    return (name || "")
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => (w.length <= 2 ? w[0] + "*" : w.slice(0, 2) + "*".repeat(Math.min(w.length - 2, 8))))
        .join(" ");
}

/* ------------------------------------------------------------------ */
/* Tanggal                                                             */
/* ------------------------------------------------------------------ */

/** YYYY-MM-DD menurut zona waktu perangkat (bukan UTC, agar tidak mundur sehari). */
export function toLocalDateInput(d: Date = new Date()): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** "2026-09-25" -> "Jumat, 25 September 2026" */
export function formatLongDate(iso: string): string {
    if (!iso) return "-";
    const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function isToday(iso: string): boolean {
    return iso?.slice(0, 10) === toLocalDateInput();
}

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */

export type Tone = "amber" | "emerald" | "rose" | "sky" | "slate";

export const toneClasses: Record<Tone, { badge: string; box: string; dot: string }> = {
    amber: { badge: "bg-amber-50 text-amber-800 border-amber-200", box: "bg-amber-50 border-amber-200 text-amber-900", dot: "bg-amber-500" },
    emerald: { badge: "bg-emerald-50 text-emerald-800 border-emerald-200", box: "bg-emerald-50 border-emerald-200 text-emerald-900", dot: "bg-emerald-500" },
    rose: { badge: "bg-rose-50 text-rose-800 border-rose-200", box: "bg-rose-50 border-rose-200 text-rose-900", dot: "bg-rose-500" },
    sky: { badge: "bg-sky-50 text-sky-800 border-sky-200", box: "bg-sky-50 border-sky-200 text-sky-900", dot: "bg-sky-500" },
    slate: { badge: "bg-slate-100 text-slate-700 border-slate-200", box: "bg-slate-50 border-slate-200 text-slate-800", dot: "bg-slate-400" },
};

export interface BookingStatusMeta {
    label: string;
    tone: Tone;
    /** Tahap aktif pada stepper (0-based): 0 terkirim, 1 verifikasi, 2 keputusan, 3 hari kunjungan */
    step: number;
    description: string;
}

export function getBookingStatusMeta(status: BookingStatus | string): BookingStatusMeta {
    switch (status) {
        case "Diterima":
            return {
                label: "Diterima",
                tone: "emerald",
                step: 3,
                description:
                    "Pendaftaran Anda telah disetujui petugas. Datanglah pada tanggal kunjungan dan tunjukkan Nomor Booking di loket pendaftaran. Nomor antrean dapat dipantau pada hari kunjungan.",
            };
        case "Ditolak":
            return {
                label: "Ditolak",
                tone: "rose",
                step: 2,
                description:
                    "Mohon maaf, pendaftaran Anda belum dapat kami setujui (misalnya kuota penuh atau jadwal dokter tutup). Silakan mendaftar ulang pada tanggal lain atau hubungi kami.",
            };
        default:
            return {
                label: "Menunggu Konfirmasi",
                tone: "amber",
                step: 1,
                description:
                    "Pendaftaran Anda sudah kami terima dan sedang diverifikasi oleh petugas admisi. Silakan cek kembali secara berkala menggunakan Nomor Booking Anda.",
            };
    }
}

export function getQueueStatusMeta(status: QueueServiceStatus): { label: string; tone: Tone; description: string } {
    switch (status) {
        case "Belum":
            return { label: "Menunggu Dipanggil", tone: "amber", description: "Silakan menunggu di ruang tunggu poliklinik hingga nama/nomor Anda dipanggil." };
        case "Berkas Diterima":
            return { label: "Berkas Diterima / Sedang Dipanggil", tone: "sky", description: "Berkas Anda sudah masuk ke poliklinik. Mohon bersiap menuju ruang pemeriksaan." };
        case "Sudah":
            return { label: "Pemeriksaan Selesai", tone: "emerald", description: "Pemeriksaan Anda telah selesai. Silakan menuju kasir/farmasi bila diperlukan." };
        case "Batal":
            return { label: "Dibatalkan", tone: "rose", description: "Pendaftaran pada hari ini dibatalkan. Hubungi petugas pendaftaran untuk informasi lebih lanjut." };
        default:
            return { label: String(status || "Terdaftar"), tone: "slate", description: "Status pelayanan Anda sedang diperbarui." };
    }
}

/* ------------------------------------------------------------------ */
/* Bukti pendaftaran tersimpan di perangkat                            */
/* ------------------------------------------------------------------ */

export interface SavedBooking {
    noBooking: string;
    noTelp: string; // format 08...
    nama: string;
    kdPoli: string;
    nmPoli: string;
    tanggal: string; // YYYY-MM-DD
    savedAt: string; // ISO
}

const STORAGE_KEY = "rsia_saved_bookings_v1";
const MAX_SAVED = 10;

export function getSavedBookings(): SavedBooking[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as SavedBooking[]) : [];
    } catch {
        return [];
    }
}

function writeSaved(list: SavedBooking[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
    } catch {
        /* penyimpanan penuh / diblokir: abaikan, fitur ini hanya kenyamanan */
    }
}

export function saveBooking(item: SavedBooking) {
    const rest = getSavedBookings().filter((b) => b.noBooking !== item.noBooking);
    writeSaved([item, ...rest]);
}

export function removeSavedBooking(noBooking: string) {
    writeSaved(getSavedBookings().filter((b) => b.noBooking !== noBooking));
}

export function clearSavedBookings() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* noop */
    }
}

/** Cari pendaftaran yang sudah tersimpan untuk nomor HP + tanggal + poli yang sama. */
export function findDuplicateSaved(noTelp: string, tanggal: string, kdPoli: string): SavedBooking | undefined {
    const phone = normalizePhone(noTelp);
    return getSavedBookings().find(
        (b) => normalizePhone(b.noTelp) === phone && b.tanggal === tanggal && b.kdPoli === kdPoli
    );
}