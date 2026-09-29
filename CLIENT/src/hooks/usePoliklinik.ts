import { useCallback, useEffect, useMemo, useState } from "react";
import { api, Poliklinik } from "@/app/api";

// Cache tingkat modul: daftar poliklinik jarang berubah dan dipakai di dua halaman.
let cache: Poliklinik[] | null = null;

/** Mengambil master poliklinik aktif dari SIMRS (GET /api/v1/poliklinik). */
export function usePoliklinik() {
    const [list, setList] = useState<Poliklinik[]>(cache ?? []);
    const [loading, setLoading] = useState(cache === null);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.simrs.getPoliklinik();
            const data = Array.isArray(res?.data) ? res.data : [];
            cache = data;
            setList(data);
        } catch (err: any) {
            setError(err?.message || "Gagal memuat daftar poliklinik.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (cache === null) load();
    }, [load]);

    const nameOf = useMemo(() => {
        const map = new Map(list.map((p) => [p.kdPoli, p.nmPoli]));
        return (kd: string) => map.get(kd) || kd;
    }, [list]);

    return { poliklinik: list, loading, error, reload: load, nameOf };
}