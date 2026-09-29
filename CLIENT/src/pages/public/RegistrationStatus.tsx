import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    AlertCircle,
    BookmarkPlus,
    CalendarCheck,
    CalendarDays,
    History,
    Info,
    Loader2,
    MessageCircle,
    RefreshCw,
    Search,
    Ticket,
    Trash2,
    Users,
    Radio,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/store";
import {
    api,
    BookingStatusResult,
    QueueResult,
    QueueStreamSnapshot,
    VisitHistoryItem,
} from "@/app/api";
import { usePoliklinik } from "@/hooks/usePoliklinik";
import { RegistrationShell, ProgressSteps } from "@/components/registration/RegistrationShell";
import {
    SavedBooking,
    clearSavedBookings,
    formatLongDate,
    getBookingStatusMeta,
    getQueueStatusMeta,
    getSavedBookings,
    isToday,
    isValidIndonesianMobile,
    maskName,
    maskPhone,
    normalizePhone,
    phoneVariants,
    removeSavedBooking,
    saveBooking,
    toneClasses,
} from "@/utils/booking";
import { cn } from "@/utils/cn";

type TabKey = "booking" | "queue" | "history";

const BOOKING_RE = /^BP\d{10,16}$/;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Pesan error yang ramah pasien berdasarkan status HTTP dari server. */
function friendlyError(err: any, notFound: string): string {
    if (err?.status === 404) return notFound;
    if (err?.status === 429) return "Terlalu banyak permintaan dari perangkat ini. Mohon tunggu sebentar lalu coba lagi.";
    if (err?.status === 422 || err?.status === 400) return err?.message || "Data yang dimasukkan tidak valid.";
    if (!err?.status) return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.";
    return err?.message || "Terjadi kendala pada server. Silakan coba beberapa saat lagi.";
}

/** Coba tiap varian nomor telepon (08... lalu 628...) sampai ada yang ditemukan. */
async function tryPhoneVariants<T>(phone: string, call: (p: string) => Promise<T>): Promise<T> {
    const variants = phoneVariants(phone);
    let lastErr: unknown;
    for (const v of variants) {
        try {
            return await call(v);
        } catch (err: any) {
            lastErr = err;
            // Hanya lanjut ke varian berikutnya bila "tidak ditemukan"; error lain langsung dihentikan.
            if (err?.status !== 404) throw err;
        }
    }
    throw lastErr;
}

/** Pembaruan antrean live lewat Server-Sent Events. */
function useQueueStream(kdPoli?: string) {
    const [snapshot, setSnapshot] = useState<QueueStreamSnapshot | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setSnapshot(null);
        setConnected(false);
        if (!kdPoli || typeof EventSource === "undefined") return;

        const es = new EventSource(api.simrs.queueStreamUrl(kdPoli));
        es.onopen = () => setConnected(true);
        es.onmessage = (e) => {
            try {
                const data: QueueStreamSnapshot = JSON.parse(e.data);
                if (data.error) {
                    setConnected(false);
                } else {
                    setSnapshot(data);
                    setConnected(true);
                }
            } catch {
                /* abaikan pesan tidak valid */
            }
        };
        es.onerror = () => setConnected(false);
        return () => es.close();
    }, [kdPoli]);

    return { snapshot, connected };
}

function ErrorBox({ message }: { message: string }) {
    return (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{message}</p>
        </div>
    );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-sky-50 border border-sky-200 text-sky-900 rounded-xl p-4 flex gap-3 text-sm">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-sky-600" />
            <div className="leading-relaxed">
                <p className="font-semibold mb-0.5">{title}</p>
                <div className="text-sky-800/90">{children}</div>
            </div>
        </div>
    );
}

function StatusBadge({ label, tone }: { label: string; tone: keyof typeof toneClasses }) {
    const t = toneClasses[tone];
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", t.badge)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", t.dot)} /> {label}
        </span>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="font-semibold text-slate-900 text-sm">{children}</dd>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Tab 1 — Status booking                                              */
/* ------------------------------------------------------------------ */

function BookingTab({
    nameOf,
    initialBooking,
    onGoQueue,
}: {
    nameOf: (kd: string) => string;
    initialBooking: string;
    onGoQueue: (phone: string) => void;
}) {
    const [input, setInput] = useState(initialBooking);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ data: BookingStatusResult; fetchedAt: Date } | null>(null);
    const [saved, setSaved] = useState<SavedBooking[]>(() => getSavedBookings());
    const [cooling, setCooling] = useState(false);
    const autoRan = useRef(false);

    const refreshSaved = () => setSaved(getSavedBookings());
    const savedMatch = result ? saved.find((s) => s.noBooking === result.data.noBooking) : undefined;

    const run = useCallback(async (raw: string) => {
        const no = raw.trim().toUpperCase().replace(/\s+/g, "");
        setInput(no);
        setError(null);
        if (!BOOKING_RE.test(no)) {
            setResult(null);
            setError("Format Nomor Booking tidak valid. Contoh: BP202609250001");
            return;
        }
        setLoading(true);
        try {
            const res = await api.simrs.check(no);
            setResult({ data: res.data, fetchedAt: new Date() });
        } catch (err: any) {
            setResult(null);
            setError(friendlyError(err, "Nomor Booking tidak ditemukan. Periksa kembali penulisannya."));
        } finally {
            setLoading(false);
            setCooling(true);
            setTimeout(() => setCooling(false), 3000);
        }
    }, []);

    // Otomatis cek saat halaman dibuka dari bukti pendaftaran (?booking=...)
    useEffect(() => {
        if (initialBooking && !autoRan.current) {
            autoRan.current = true;
            run(initialBooking);
        }
    }, [initialBooking, run]);

    const meta = result ? getBookingStatusMeta(result.data.status) : null;
    const rejected = result?.data.status === "Ditolak";
    const decisionLabel = !result ? "Keputusan" : rejected ? "Ditolak" : result.data.status === "Diterima" ? "Diterima" : "Keputusan";
    const isVisitToday = result ? isToday(result.data.tanggal) : false;

    return (
        <div className="space-y-6">
            <Card className="p-5 sm:p-7 shadow-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        run(input);
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="noBooking">Nomor Booking</Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                id="noBooking"
                                value={input}
                                onChange={(e) => setInput(e.target.value.toUpperCase())}
                                placeholder="Contoh: BP202609250001"
                                autoComplete="off"
                                spellCheck={false}
                                className="h-11 font-mono tracking-wide uppercase"
                            />
                            <Button type="submit" className="h-11 px-6 gap-2" disabled={loading || !input.trim()}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Cek Status
                            </Button>
                        </div>
                        <p className="text-[11px] text-slate-500">Nomor Booking diberikan setelah Anda berhasil mendaftar online.</p>
                    </div>
                </form>
            </Card>

            {error && <ErrorBox message={error} />}

            {result && meta && (
                <Card className="overflow-hidden shadow-lg border-slate-200">
                    <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                        <div>
                            <p className="text-xs text-slate-500">Nomor Booking</p>
                            <p className="text-2xl font-mono font-bold tracking-wider text-slate-900">{result.data.noBooking}</p>
                        </div>
                        <StatusBadge label={meta.label} tone={meta.tone} />
                    </div>

                    <div className="p-6 space-y-6">
                        <ProgressSteps
                            steps={["Terkirim", "Verifikasi petugas", decisionLabel, "Hari kunjungan"]}
                            current={meta.step}
                            failedAt={rejected ? 2 : undefined}
                        />

                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                            <Row label="Nama Pasien">{savedMatch ? result.data.nama : maskName(result.data.nama)}</Row>
                            <Row label="Poliklinik">{nameOf(result.data.kdPoli)}</Row>
                            <Row label="Tanggal Kunjungan">
                                {formatLongDate(result.data.tanggal)}
                                {isVisitToday && <span className="ml-2 text-[11px] font-bold text-primary">HARI INI</span>}
                            </Row>
                        </dl>

                        <div className={cn("rounded-xl border p-4 text-sm leading-relaxed", toneClasses[meta.tone].box)}>{meta.description}</div>

                        {result.data.status === "Diterima" && (
                            <div className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-sm">
                                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-primary" /> Nomor antrean
                                    </p>
                                    <p className="text-slate-600 text-xs mt-0.5">
                                        {isVisitToday
                                            ? "Hari ini adalah jadwal kunjungan Anda. Pantau urutan antrean langsung di sini."
                                            : "Nomor antrean tersedia pada hari kunjungan setelah Anda diregistrasi di loket pendaftaran."}
                                    </p>
                                </div>
                                <Button variant={isVisitToday ? "default" : "outline"} className="gap-2 shrink-0" onClick={() => onGoQueue(savedMatch?.noTelp || "")}>
                                    Cek Antrean Hari Ini
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => run(result.data.noBooking)} disabled={loading || cooling}>
                                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Perbarui
                            </Button>
                            {!savedMatch && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-primary"
                                    onClick={() => {
                                        saveBooking({
                                            noBooking: result.data.noBooking,
                                            noTelp: "",
                                            nama: result.data.nama,
                                            kdPoli: result.data.kdPoli,
                                            nmPoli: nameOf(result.data.kdPoli),
                                            tanggal: result.data.tanggal,
                                            savedAt: new Date().toISOString(),
                                        });
                                        refreshSaved();
                                    }}
                                >
                                    <BookmarkPlus className="w-4 h-4" /> Simpan di perangkat ini
                                </Button>
                            )}
                            <span className="text-[11px] text-slate-400 ml-auto">
                                Diperbarui {result.fetchedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                </Card>
            )}

            {/* Bukti tersimpan di perangkat */}
            {saved.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-primary" /> Pendaftaran di perangkat ini
                        </h3>
                        <button
                            type="button"
                            className="text-xs text-slate-500 hover:text-rose-600 inline-flex items-center gap-1"
                            onClick={() => {
                                clearSavedBookings();
                                refreshSaved();
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus semua
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {saved.map((b) => (
                            <div key={b.noBooking} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-mono font-bold text-slate-900 text-sm">{b.noBooking}</p>
                                    <p className="text-xs text-slate-600 truncate mt-0.5">{b.nmPoli}</p>
                                    <p className="text-xs text-slate-500">{formatLongDate(b.tanggal)}</p>
                                    {b.noTelp && <p className="text-[11px] text-slate-400 mt-1">{maskPhone(b.noTelp)}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 shrink-0">
                                    <Button size="sm" className="h-8 px-3 text-xs" onClick={() => run(b.noBooking)} disabled={loading}>Cek</Button>
                                    <button
                                        type="button"
                                        aria-label={`Hapus ${b.noBooking} dari perangkat`}
                                        className="text-[11px] text-slate-400 hover:text-rose-600"
                                        onClick={() => {
                                            removeSavedBooking(b.noBooking);
                                            refreshSaved();
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Tab 2 — Antrean hari ini                                            */
/* ------------------------------------------------------------------ */

function QueueTab({ nameOf, initialPhone }: { nameOf: (kd: string) => string; initialPhone: string }) {
    const [phone, setPhone] = useState(initialPhone);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [result, setResult] = useState<{ data: QueueResult; usedPhone: string; fetchedAt: Date } | null>(null);
    const [cooling, setCooling] = useState(false);
    const lastFetch = useRef(0);
    const autoRan = useRef(false);

    const { snapshot, connected } = useQueueStream(result?.data.kdPoli);

    const run = useCallback(async (raw: string, silent = false) => {
        if (!isValidIndonesianMobile(raw)) {
            setError("Nomor HP tidak valid. Contoh: 081234567890");
            return;
        }
        if (!silent) {
            setLoading(true);
            setError(null);
            setNotFound(false);
        }
        try {
            let used = "";
            const res = await tryPhoneVariants(raw, async (p) => {
                used = p;
                return api.simrs.checkQueue(p);
            });
            lastFetch.current = Date.now();
            setResult({ data: res.data, usedPhone: used, fetchedAt: new Date() });
            setNotFound(false);
        } catch (err: any) {
            if (silent) return; // pembaruan otomatis: pertahankan data terakhir
            setResult(null);
            if (err?.status === 404) setNotFound(true);
            else setError(friendlyError(err, ""));
        } finally {
            if (!silent) {
                setLoading(false);
                setCooling(true);
                setTimeout(() => setCooling(false), 3000);
            }
        }
    }, []);

    useEffect(() => {
        if (initialPhone && !autoRan.current && isValidIndonesianMobile(initialPhone)) {
            autoRan.current = true;
            run(initialPhone);
        }
    }, [initialPhone, run]);

    const finished = result && (result.data.status === "Sudah" || result.data.status === "Batal");

    // Segarkan otomatis tiap 30 detik + saat jumlah antrean live berubah (min. jeda 10 detik)
    useEffect(() => {
        if (!result || finished) return;
        const id = setInterval(() => run(result.usedPhone, true), 30_000);
        return () => clearInterval(id);
    }, [result, finished, run]);

    useEffect(() => {
        if (!result || finished || snapshot?.waiting === undefined) return;
        if (Date.now() - lastFetch.current > 10_000) run(result.usedPhone, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot?.waiting]);

    const meta = result ? getQueueStatusMeta(result.data.status) : null;

    return (
        <div className="space-y-6">
            <Card className="p-5 sm:p-7 shadow-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        run(phone);
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="queuePhone">Nomor HP yang didaftarkan</Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                id="queuePhone"
                                type="tel"
                                inputMode="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="081234567890"
                                className="h-11"
                            />
                            <Button type="submit" className="h-11 px-6 gap-2" disabled={loading || !phone.trim()}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />} Cek Antrean
                            </Button>
                        </div>
                        <p className="text-[11px] text-slate-500">Antrean hanya tersedia pada hari kunjungan, setelah pendaftaran Anda diproses di loket/admisi.</p>
                    </div>
                </form>
            </Card>

            {error && <ErrorBox message={error} />}

            {notFound && (
                <InfoBox title="Belum ada antrean aktif hari ini">
                    Kami tidak menemukan pendaftaran rawat jalan untuk nomor tersebut pada hari ini. Jika jadwal kunjungan Anda hari ini,
                    pastikan Anda sudah melapor di loket pendaftaran. Anda juga dapat memeriksa status di tab “Status Pendaftaran”.
                </InfoBox>
            )}

            {result && meta && (
                <Card className="overflow-hidden shadow-lg border-slate-200">
                    <div className="bg-gradient-to-br from-primary to-rose-700 text-white p-6 sm:p-8 text-center">
                        <p className="text-xs uppercase tracking-widest text-white/80">Urutan Antrean Anda</p>
                        <p className="text-6xl sm:text-7xl font-bold font-mono my-2 leading-none">{String(result.data.queuePosition).padStart(3, "0")}</p>
                        <p className="text-sm text-white/90">{nameOf(result.data.kdPoli)}</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <StatusBadge label={meta.label} tone={meta.tone} />
                            <span className="text-xs text-slate-500 font-mono">No. Rawat {result.data.noRawat}</span>
                        </div>
                        <div className={cn("rounded-xl border p-4 text-sm leading-relaxed", toneClasses[meta.tone].box)}>{meta.description}</div>

                        {/* Live */}
                        <div className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" /> Kondisi antrean poliklinik
                                </p>
                                <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold", connected ? "text-emerald-600" : "text-slate-400")}>
                                    <Radio className={cn("w-3.5 h-3.5", connected && "animate-pulse")} /> {connected ? "Live" : "Menghubungkan..."}
                                </span>
                            </div>
                            {snapshot ? (
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="rounded-lg bg-slate-50 py-3">
                                        <p className="text-2xl font-bold text-slate-900">{snapshot.waiting ?? "-"}</p>
                                        <p className="text-[11px] text-slate-500">Pasien menunggu</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 py-3">
                                        <p className="text-2xl font-bold text-slate-900">{snapshot.totalToday ?? "-"}</p>
                                        <p className="text-[11px] text-slate-500">Total pendaftar hari ini</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500">Menunggu data antrean live...</p>
                            )}
                            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                                Urutan dihitung dari waktu pendaftaran pada poliklinik yang sama. Estimasi waktu panggil dapat berubah menyesuaikan
                                lamanya pemeriksaan tiap pasien.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => run(result.usedPhone)} disabled={loading || cooling}>
                                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Perbarui
                            </Button>
                            <span className="text-[11px] text-slate-400 ml-auto">
                                {finished ? "Pembaruan otomatis dihentikan" : "Otomatis diperbarui tiap 30 detik"} ·{" "}
                                {result.fetchedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Tab 3 — Riwayat kunjungan                                           */
/* ------------------------------------------------------------------ */

const CARE_TYPE: Record<string, string> = { Ralan: "Rawat Jalan", Ranap: "Rawat Inap" };

function HistoryTab({ nameOf, initialPhone }: { nameOf: (kd: string) => string; initialPhone: string }) {
    const [phone, setPhone] = useState(initialPhone);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<VisitHistoryItem[] | null>(null);

    const run = async (raw: string) => {
        if (!isValidIndonesianMobile(raw)) {
            setError("Nomor HP tidak valid. Contoh: 081234567890");
            return;
        }
        setLoading(true);
        setError(null);
        setItems(null);
        try {
            // Server mencocokkan nomor secara persis: coba 08... lalu 628... bila hasil kosong.
            let found: VisitHistoryItem[] = [];
            for (const v of phoneVariants(raw)) {
                const res = await api.simrs.history(v);
                found = Array.isArray(res.data) ? res.data : [];
                if (found.length > 0) break;
            }
            setItems(found);
        } catch (err: any) {
            setError(friendlyError(err, "Data tidak ditemukan."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-5 sm:p-7 shadow-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        run(phone);
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="historyPhone">Nomor HP pasien</Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input id="historyPhone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="h-11" />
                            <Button type="submit" className="h-11 px-6 gap-2" disabled={loading || !phone.trim()}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />} Lihat Riwayat
                            </Button>
                        </div>
                        <p className="text-[11px] text-slate-500">Menampilkan hingga 20 kunjungan terakhir yang tercatat di sistem rumah sakit.</p>
                    </div>
                </form>
            </Card>

            {error && <ErrorBox message={error} />}

            {items && items.length === 0 && (
                <InfoBox title="Belum ada riwayat kunjungan">
                    Tidak ada catatan kunjungan untuk nomor ini. Pastikan nomor sama dengan yang tercatat di rumah sakit, atau hubungi petugas pendaftaran.
                </InfoBox>
            )}

            {items && items.length > 0 && (
                <div className="space-y-3">
                    {items.map((v) => (
                        <Card key={v.noRawat} className="p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <CalendarDays className="w-5 h-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm">{formatLongDate(v.tglRegistrasi)}</p>
                                    <p className="text-xs text-slate-600 mt-0.5">{nameOf(v.kdPoli)}</p>
                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">No. Rawat {v.noRawat}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:justify-end">
                                <StatusBadge label={CARE_TYPE[v.statusLanjut] || v.statusLanjut || "-"} tone="sky" />
                                {v.statusBayar && <StatusBadge label={v.statusBayar} tone="slate" />}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function RegistrationStatus() {
    const { settings } = useStore();
    const { nameOf } = usePoliklinik();
    const [params, setParams] = useSearchParams();

    const initialBooking = (params.get("booking") || "").toUpperCase();
    const initialTab: TabKey = (["booking", "queue", "history"] as TabKey[]).includes(params.get("tab") as TabKey)
        ? (params.get("tab") as TabKey)
        : params.get("telp")
            ? "queue"
            : "booking";

    const [tab, setTab] = useState<TabKey>(initialTab);
    // Nomor HP yang diketahui dari bukti tersimpan (untuk mengisi otomatis tab lain)
    const knownPhone = useMemo(() => normalizePhone(params.get("telp") || getSavedBookings().find((b) => b.noTelp)?.noTelp || ""), [params]);
    const [queuePhone, setQueuePhone] = useState(knownPhone);

    const switchTab = (t: TabKey) => {
        setTab(t);
        const next = new URLSearchParams(params);
        next.set("tab", t);
        setParams(next, { replace: true });
    };

    const tabs: { key: TabKey; label: string; icon: typeof Search }[] = [
        { key: "booking", label: "Status Pendaftaran", icon: Search },
        { key: "queue", label: "Antrean Hari Ini", icon: Ticket },
        { key: "history", label: "Riwayat Kunjungan", icon: History },
    ];

    const wa = (settings.whatsapp || "").replace(/\D/g, "");

    return (
        <RegistrationShell
            title="Cek Pendaftaran & Antrean"
            subtitle="Lihat kembali Nomor Booking, pantau status persetujuan, dan cek urutan antrean Anda pada hari kunjungan."
            maxWidth="max-w-3xl"
        >
            <div role="tablist" aria-label="Jenis pengecekan" className="grid grid-cols-3 gap-2 mb-6">
                {tabs.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        role="tab"
                        type="button"
                        aria-selected={tab === key}
                        onClick={() => switchTab(key)}
                        className={cn(
                            "flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 py-3 text-[11px] sm:text-sm font-semibold transition-all text-center leading-tight",
                            tab === key
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            <div role="tabpanel">
                {tab === "booking" && (
                    <BookingTab
                        nameOf={nameOf}
                        initialBooking={initialBooking}
                        onGoQueue={(phone) => {
                            if (phone) setQueuePhone(phone);
                            switchTab("queue");
                        }}
                    />
                )}
                {tab === "queue" && <QueueTab nameOf={nameOf} initialPhone={queuePhone} />}
                {tab === "history" && <HistoryTab nameOf={nameOf} initialPhone={queuePhone} />}
            </div>

            <Card className="mt-8 p-5 shadow-sm bg-slate-50/70 border-slate-200">
                <p className="text-sm font-semibold text-slate-900 mb-1">Lupa Nomor Booking atau data tidak ditemukan?</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Hubungi petugas pendaftaran dengan menyebutkan nama pasien dan nomor HP yang didaftarkan. Kami akan membantu menelusuri pendaftaran Anda.
                </p>
                <div className="flex flex-wrap gap-3">
                    {wa && (
                        <Button asChild size="sm" variant="outline" className="gap-2 bg-white">
                            <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Halo, saya ingin menanyakan pendaftaran online saya.")}`} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-4 h-4" /> Chat WhatsApp
                            </a>
                        </Button>
                    )}
                    <Button asChild size="sm" variant="ghost" className="text-primary">
                        <Link to="/pendaftaran">Buat pendaftaran baru</Link>
                    </Button>
                </div>
            </Card>
        </RegistrationShell>
    );
}