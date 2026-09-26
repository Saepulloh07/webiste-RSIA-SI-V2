/**
 * RSIA Sayang Ibu — Notifikasi Aksi (SweetAlert2)
 * Wrapper terpusat agar seluruh halaman admin/CMS menampilkan feedback
 * yang konsisten (sukses, gagal, konfirmasi) untuk setiap aksi CRUD.
 */
import Swal from "sweetalert2";

const BRAND_COLOR = "#e11d48"; // rose-600, senada dengan warna primary aplikasi
const NEUTRAL_COLOR = "#64748b"; // slate-500

/** Notifikasi sukses (toast kecil, auto-hilang). */
export function alertSuccess(title: string, text?: string) {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: BRAND_COLOR,
        timer: 2200,
        showConfirmButton: false,
        timerProgressBar: true,
    });
}

/** Notifikasi gagal/error — tetap terbuka sampai ditutup pengguna. */
export function alertError(title: string, text?: string) {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonText: "Mengerti",
        confirmButtonColor: BRAND_COLOR,
    });
}

/** Notifikasi peringatan (mis. tersimpan lokal karena server tidak terjangkau). */
export function alertWarning(title: string, text?: string) {
    return Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonText: "Mengerti",
        confirmButtonColor: BRAND_COLOR,
    });
}

/** Dialog konfirmasi (mis. sebelum menghapus data). Mengembalikan `true` jika disetujui. */
export async function alertConfirm(
    title: string,
    text?: string,
    confirmText: string = "Ya, lanjutkan",
    cancelText: string = "Batal"
): Promise<boolean> {
    const result = await Swal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: BRAND_COLOR,
        cancelButtonColor: NEUTRAL_COLOR,
        reverseButtons: true,
        focusCancel: true,
    });
    return result.isConfirmed;
}

/**
 * Mengambil pesan error yang paling informatif dari error yang dilempar oleh `api.ts`.
 * Jika backend mengirim rincian per-field (mis. hasil validasi class-validator),
 * pesan-pesan tersebut digabung agar pengguna tahu persis kolom mana yang bermasalah.
 */
export function extractApiErrorMessage(
    err: unknown,
    fallback: string = "Terjadi kesalahan. Silakan coba lagi."
): string {
    const anyErr = err as { message?: string; details?: { errors?: Record<string, string[]> } } | undefined;
    const fieldErrors = anyErr?.details?.errors;

    if (fieldErrors && typeof fieldErrors === "object") {
        const messages = Object.values(fieldErrors).flat().filter(Boolean) as string[];
        if (messages.length > 0) return messages.join("\n");
    }

    if (anyErr?.message) return anyErr.message;
    return fallback;
}

/** True jika error berasal dari validasi input (HTTP 422) dan bukan masalah koneksi/server. */
export function isValidationError(err: unknown): boolean {
    const anyErr = err as { status?: number } | undefined;
    return anyErr?.status === 422;
}