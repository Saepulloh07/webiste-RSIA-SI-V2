import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Loader2,
  Lock,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/store";
import { api, BookingRegisterResult } from "@/app/api";
import { usePoliklinik } from "@/hooks/usePoliklinik";
import { RegistrationShell, ProgressSteps } from "@/components/registration/RegistrationShell";
import {
  findDuplicateSaved,
  formatLongDate,
  getBookingStatusMeta,
  isValidIndonesianMobile,
  normalizePhone,
  saveBooking,
  getSavedBookings,
  toLocalDateInput,
  toneClasses,
  SavedBooking,
} from "@/utils/booking";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Skema validasi — batas panjang mengikuti DTO server (RegisterBookingDto) */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 250; // sisa dari 400 karakter dipakai untuk info status/pembayaran/dokter

const registrationSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(40, "Nama maksimal 40 karakter (gunakan singkatan gelar bila perlu)"),
  phone: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp/HP wajib diisi")
    .refine(isValidIndonesianMobile, "Nomor tidak valid. Contoh: 081234567890"),
  email: z
    .string()
    .trim()
    .max(50, "Email maksimal 50 karakter")
    .refine((v) => v === "" || EMAIL_RE.test(v), "Format email tidak valid"),
  address: z.string().trim().min(5, "Alamat wajib diisi").max(200, "Alamat maksimal 200 karakter"),
  patientType: z.enum(["baru", "lama"], { message: "Pilih status pasien" }),
  paymentMethod: z.enum(["umum", "bpjs", "asuransi"], { message: "Pilih metode pembayaran" }),
  kdPoli: z.string().min(1, "Pilih poliklinik tujuan"),
  preferredDoctorId: z.string().optional(),
  date: z.string().min(1, "Pilih tanggal kunjungan"),
  notes: z.string().max(NOTES_MAX, `Maksimal ${NOTES_MAX} karakter`).optional(),
  consent: z.boolean().refine((v) => v === true, "Anda perlu menyetujui pernyataan ini"),
});

type FormValues = z.infer<typeof registrationSchema>;

const PATIENT_TYPE_LABEL = { baru: "Pasien Baru", lama: "Pasien Lama" } as const;
const PAYMENT_LABEL = { umum: "Umum/Pribadi", bpjs: "BPJS Kesehatan", asuransi: "Asuransi Lainnya" } as const;

/** Nama field di response validasi server -> nama field di form. */
const SERVER_FIELD_MAP: Record<string, FieldPath<FormValues>> = {
  nama: "patientName",
  noTelp: "phone",
  email: "email",
  alamat: "address",
  kdPoli: "kdPoli",
  tanggal: "date",
  tambahanPesan: "notes",
};

interface Receipt extends BookingRegisterResult {
  nama: string;
  noTelp: string;
}

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {message}
    </p>
  );
}

const inputErr = (invalid?: boolean) => (invalid ? "border-rose-400 focus-visible:ring-rose-400" : "");

function SectionTitle({ icon: Icon, children }: { icon: typeof UserRound; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </span>
      <h2 className="text-base font-bold text-slate-900 font-sans">{children}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bukti pendaftaran (setelah berhasil)                                */
/* ------------------------------------------------------------------ */

function BookingReceipt({ receipt, onNew }: { receipt: Receipt; onNew: () => void }) {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const meta = getBookingStatusMeta(receipt.status);
  const tone = toneClasses[meta.tone];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.noBooking);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  const waText = encodeURIComponent(
    `Bukti pendaftaran online ${settings.hospitalName || "RSIA Sayang Ibu"}\n` +
    `No. Booking: ${receipt.noBooking}\nPasien: ${receipt.nama}\nPoliklinik: ${receipt.nmPoli}\n` +
    `Tanggal: ${formatLongDate(receipt.tanggal)}\n\nCek status: ${window.location.origin}/pendaftaran/cek?booking=${receipt.noBooking}`
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900">Pendaftaran Berhasil Dikirim</h2>
        <p className="text-slate-600 text-sm mt-2">
          Simpan Nomor Booking di bawah ini. Anda memerlukannya untuk mengecek status dan saat datang ke rumah sakit.
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg border-slate-200">
        <div className="bg-gradient-to-r from-primary to-rose-700 text-white px-6 py-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/80 mb-1">Nomor Booking</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl sm:text-4xl font-mono font-bold tracking-wider select-all">{receipt.noBooking}</p>
            <button
              type="button"
              onClick={copy}
              aria-label="Salin nomor booking"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* garis sobekan tiket */}
        <div className="relative h-0 border-t-2 border-dashed border-slate-200">
          <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-rose-50/70" />
          <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-rose-50/70" />
        </div>

        <div className="p-6 space-y-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Nama Pasien</dt>
              <dd className="font-semibold text-slate-900">{receipt.nama}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Poliklinik Tujuan</dt>
              <dd className="font-semibold text-slate-900">{receipt.nmPoli}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Tanggal Kunjungan</dt>
              <dd className="font-semibold text-slate-900">{formatLongDate(receipt.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", tone.badge)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", tone.dot)} /> {meta.label}
                </span>
              </dd>
            </div>
          </dl>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Langkah selanjutnya</p>
            <ProgressSteps
              steps={["Terkirim", "Verifikasi petugas", "Konfirmasi", "Hari kunjungan"]}
              current={meta.step}
            />
            <ul className="mt-4 space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc pl-4">
              <li>Petugas admisi akan memverifikasi data dan kuota dokter. Status berubah menjadi <strong>Diterima</strong> setelah disetujui.</li>
              <li>Cek status kapan saja dengan Nomor Booking Anda, tanpa perlu menunggu telepon.</li>
              <li>Pada hari kunjungan, bawa KTP (dan kartu BPJS/asuransi bila ada), lalu tunjukkan Nomor Booking di loket pendaftaran.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 h-11 gap-2">
              <Link to={`/pendaftaran/cek?booking=${encodeURIComponent(receipt.noBooking)}`}>
                <Search className="w-4 h-4" /> Cek Status & Antrean
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-11 gap-2">
              <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" /> Simpan via WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Bukti ini juga tersimpan di perangkat ini, sehingga dapat dibuka kembali pada menu “Cek Pendaftaran & Antrean”.
          </p>
        </div>
      </Card>

      <div className="text-center mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <button type="button" onClick={onNew} className="text-primary font-semibold hover:underline">
          Daftarkan pasien lain
        </button>
        <Link to="/" className="text-slate-600 hover:text-primary">Kembali ke Beranda</Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman utama                                                       */
/* ------------------------------------------------------------------ */

export default function Appointment() {
  const { registrationSettings, setRegistrationSettings, doctors, settings, fetchDoctors } = useStore();
  const { poliklinik, loading: poliLoading, error: poliError, reload: reloadPoli } = usePoliklinik();
  const [searchParams] = useSearchParams();

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<SavedBooking | null>(null);
  const allowDuplicateRef = useRef(false);
  // Status pendaftaran selalu diambil dari server setiap halaman dibuka; selama belum
  // selesai formulir TIDAK ditampilkan (mencegah formulir sempat terbuka saat sebenarnya ditutup).
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const today = toLocalDateInput();
  const lastSaved = useMemo(() => getSavedBookings()[0], []);

  const refreshRegistrationStatus = useCallback(async () => {
    try {
      const res = await api.settings.getRegistration();
      if (res?.data) setRegistrationSettings(res.data);
    } catch {
      // Server tidak terjangkau: pakai pengaturan terakhir yang tersimpan.
    }
  }, [setRegistrationSettings]);

  useEffect(() => {
    let active = true;
    refreshRegistrationStatus().finally(() => active && setIsCheckingStatus(false));
    return () => {
      active = false;
    };
  }, [refreshRegistrationStatus]);

  useEffect(() => {
    if (doctors.length === 0) fetchDoctors();
  }, [doctors.length, fetchDoctors]);

  const activeDoctors = useMemo(() => doctors.filter((d) => d.status === "Aktif"), [doctors]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      patientName: lastSaved?.nama ?? "",
      phone: lastSaved?.noTelp ?? "",
      email: "",
      address: "",
      patientType: lastSaved ? "lama" : undefined,
      paymentMethod: undefined,
      kdPoli: "",
      preferredDoctorId: "",
      date: "",
      notes: "",
      consent: false,
    },
  });

  // Prefill dokter dari tautan "Buat Janji" (?dokter=<slug|nama|id>)
  const doctorParam = searchParams.get("dokter");
  useEffect(() => {
    if (!doctorParam || activeDoctors.length === 0) return;
    const q = decodeURIComponent(doctorParam).toLowerCase();
    const match = activeDoctors.find(
      (d) => d.slug?.toLowerCase() === q || d.id.toLowerCase() === q || d.name.toLowerCase() === q
    );
    if (match) setValue("preferredDoctorId", match.id);
  }, [doctorParam, activeDoctors, setValue]);

  const notesValue = watch("notes") || "";

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    if (!registrationSettings.isOpen) return; // pengaman: formulir tidak boleh terkirim saat ditutup

    const tanggal = data.date;
    if (!allowDuplicateRef.current) {
      const dup = findDuplicateSaved(data.phone, tanggal, data.kdPoli);
      if (dup) {
        setDuplicate(dup);
        return;
      }
    }
    allowDuplicateRef.current = false;
    setDuplicate(null);

    const phone = normalizePhone(data.phone);
    const doctor = activeDoctors.find((d) => d.id === data.preferredDoctorId);

    // Server hanya memiliki kolom `tambahanPesan` (maks. 400 karakter) untuk informasi tambahan,
    // sehingga status pasien, pembayaran, dan dokter pilihan disertakan di sini untuk petugas admisi.
    const tambahanPesan = [
      PATIENT_TYPE_LABEL[data.patientType],
      `Bayar: ${PAYMENT_LABEL[data.paymentMethod]}`,
      doctor ? `Dokter pilihan: ${doctor.name}` : null,
      data.notes?.trim() ? `Keluhan: ${data.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 400);

    try {
      const res = await api.simrs.register({
        nama: data.patientName.trim(),
        alamat: data.address.trim(),
        noTelp: phone,
        email: data.email.trim() || undefined,
        kdPoli: data.kdPoli,
        tanggal,
        tambahanPesan,
      });

      const result = res.data;
      saveBooking({
        noBooking: result.noBooking,
        noTelp: phone,
        nama: data.patientName.trim(),
        kdPoli: result.kdPoli,
        nmPoli: result.nmPoli,
        tanggal: result.tanggal,
        savedAt: new Date().toISOString(),
      });
      setReceipt({ ...result, nama: data.patientName.trim(), noTelp: phone });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.warn("Pendaftaran online gagal:", err);

      // Rincian per-field dari validasi server (HTTP 422) -> tandai kolom terkait
      const fieldErrors: Record<string, string[]> | undefined = err?.details?.errors;
      if (err?.status === 422 && fieldErrors) {
        Object.entries(fieldErrors).forEach(([key, msgs]) => {
          const field = SERVER_FIELD_MAP[key];
          if (field) setError(field, { type: "server", message: msgs[0] });
        });
      }

      if (err?.status === 429) {
        setSubmitError("Terlalu banyak percobaan pendaftaran dari perangkat ini. Mohon tunggu beberapa saat lalu coba lagi.");
      } else if (err?.status) {
        await refreshRegistrationStatus();
        setSubmitError(err.message || "Pendaftaran tidak dapat diproses. Silakan periksa data Anda lalu coba lagi.");
      } else {
        // Tidak pernah membuat nomor "palsu" di sisi klien: pasien harus tahu bahwa data belum terkirim.
        setSubmitError(
          "Tidak dapat terhubung ke server. Pendaftaran Anda BELUM terkirim. Periksa koneksi internet lalu tekan tombol kirim kembali — data yang sudah Anda isi tidak hilang."
        );
      }
    }
  };

  const startNew = () => {
    setReceipt(null);
    setSubmitError(null);
    reset({
      patientName: "",
      phone: "",
      email: "",
      address: "",
      patientType: undefined,
      paymentMethod: undefined,
      kdPoli: "",
      preferredDoctorId: "",
      date: "",
      notes: "",
      consent: false,
    });
  };

  /* ---------- Status: memeriksa / ditutup / berhasil ---------- */

  if (isCheckingStatus) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500" role="status" aria-live="polite">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memeriksa status pendaftaran online...</p>
        </div>
      </div>
    );
  }

  if (!registrationSettings.isOpen) {
    return (
      <RegistrationShell title="Pendaftaran Online" subtitle="Layanan pendaftaran janji temu rumah sakit." maxWidth="max-w-3xl">
        <Card className="w-full text-center p-8 border-slate-200 shadow-lg" role="alert">
          <div className="mx-auto w-16 h-16 bg-rose-50 text-primary rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Pendaftaran Online Sedang Ditutup</h2>
          <p className="text-muted-foreground mb-6">
            Mohon maaf, layanan pendaftaran online saat ini sedang ditutup. Silakan kembali lagi nanti atau hubungi kami
            secara langsung. Jika Anda sudah pernah mendaftar, status pendaftaran tetap dapat dicek.
          </p>
          {registrationSettings.noticeMessage && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-sm whitespace-pre-line text-left">
              <p>{registrationSettings.noticeMessage}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild><Link to="/pendaftaran/cek">Cek Pendaftaran & Antrean</Link></Button>
            <Button variant="outline" asChild><Link to="/">Kembali ke Beranda</Link></Button>
          </div>
        </Card>
      </RegistrationShell>
    );
  }

  if (receipt) {
    return (
      <RegistrationShell title="Pendaftaran Online" subtitle="Terima kasih telah mendaftar. Berikut bukti pendaftaran Anda.">
        <BookingReceipt receipt={receipt} onNew={startNew} />
      </RegistrationShell>
    );
  }

  /* ---------- Formulir ---------- */

  return (
    <RegistrationShell
      title="Pendaftaran Online"
      subtitle="Buat janji kunjungan tanpa antre di loket. Isi formulir, dapatkan Nomor Booking, lalu pantau statusnya kapan saja."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {submitError && (
            <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{submitError}</p>
            </div>
          )}

          {/* Data pasien */}
          <Card className="p-5 sm:p-7 shadow-sm">
            <SectionTitle icon={UserRound}>Data Pasien</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="patientName">Nama Lengkap Pasien <span className="text-rose-500">*</span></Label>
                <Input
                  id="patientName"
                  autoComplete="name"
                  placeholder="Sesuai KTP / kartu identitas"
                  aria-invalid={!!errors.patientName}
                  aria-describedby="err-patientName"
                  className={inputErr(!!errors.patientName)}
                  {...register("patientName")}
                />
                <FieldError id="err-patientName" message={errors.patientName?.message} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor WhatsApp/HP Aktif <span className="text-rose-500">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="081234567890"
                  aria-invalid={!!errors.phone}
                  aria-describedby="err-phone"
                  className={inputErr(!!errors.phone)}
                  {...register("phone")}
                />
                <FieldError id="err-phone" message={errors.phone?.message} />
                <p className="text-[11px] text-slate-500">Dipakai untuk konfirmasi dan mengecek antrean.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email <span className="text-slate-400 font-normal">(opsional)</span></Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby="err-email"
                  className={inputErr(!!errors.email)}
                  {...register("email")}
                />
                <FieldError id="err-email" message={errors.email?.message} />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address">Alamat Domisili <span className="text-rose-500">*</span></Label>
                <textarea
                  id="address"
                  rows={2}
                  autoComplete="street-address"
                  placeholder="Jalan, RT/RW, kelurahan, kecamatan"
                  aria-invalid={!!errors.address}
                  aria-describedby="err-address"
                  className={cn(
                    "flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    inputErr(!!errors.address)
                  )}
                  {...register("address")}
                />
                <FieldError id="err-address" message={errors.address?.message} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patientType">Status Pasien <span className="text-rose-500">*</span></Label>
                <NativeSelect id="patientType" aria-invalid={!!errors.patientType} className={inputErr(!!errors.patientType)} {...register("patientType")}>
                  <option value="">Pilih status pasien...</option>
                  <option value="baru">Pasien Baru (belum pernah berobat)</option>
                  <option value="lama">Pasien Lama (sudah punya No. RM)</option>
                </NativeSelect>
                <FieldError id="err-patientType" message={errors.patientType?.message} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="paymentMethod">Metode Pembayaran <span className="text-rose-500">*</span></Label>
                <NativeSelect id="paymentMethod" aria-invalid={!!errors.paymentMethod} className={inputErr(!!errors.paymentMethod)} {...register("paymentMethod")}>
                  <option value="">Pilih metode pembayaran...</option>
                  <option value="umum">Umum / Pribadi</option>
                  <option value="bpjs">BPJS Kesehatan</option>
                  <option value="asuransi">Asuransi Lainnya</option>
                </NativeSelect>
                <FieldError id="err-paymentMethod" message={errors.paymentMethod?.message} />
              </div>
            </div>
          </Card>

          {/* Kunjungan */}
          <Card className="p-5 sm:p-7 shadow-sm">
            <SectionTitle icon={Calendar}>Rencana Kunjungan</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="kdPoli">Poliklinik Tujuan <span className="text-rose-500">*</span></Label>
                <NativeSelect id="kdPoli" disabled={poliLoading && poliklinik.length === 0} aria-invalid={!!errors.kdPoli} className={inputErr(!!errors.kdPoli)} {...register("kdPoli")}>
                  <option value="">{poliLoading && poliklinik.length === 0 ? "Memuat poliklinik..." : "Pilih poliklinik..."}</option>
                  {poliklinik.map((p) => (
                    <option key={p.kdPoli} value={p.kdPoli}>{p.nmPoli}</option>
                  ))}
                </NativeSelect>
                <FieldError id="err-kdPoli" message={errors.kdPoli?.message} />
                {poliError && (
                  <p className="text-xs text-rose-600 flex items-center gap-2">
                    {poliError}
                    <button type="button" onClick={reloadPoli} className="inline-flex items-center gap-1 font-semibold underline">
                      <RefreshCw className="w-3 h-3" /> Muat ulang
                    </button>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preferredDoctorId">Dokter Pilihan <span className="text-slate-400 font-normal">(opsional)</span></Label>
                <NativeSelect id="preferredDoctorId" {...register("preferredDoctorId")}>
                  <option value="">Tidak ada preferensi</option>
                  {activeDoctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </NativeSelect>
                <p className="text-[11px] text-slate-500">Menjadi permintaan; dokter final dikonfirmasi petugas.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date">Tanggal Kunjungan <span className="text-rose-500">*</span></Label>
                <Input id="date" type="date" min={today} aria-invalid={!!errors.date} className={inputErr(!!errors.date)} {...register("date")} />
                <FieldError id="err-date" message={errors.date?.message} />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notes">Keluhan / Catatan <span className="text-slate-400 font-normal">(opsional)</span></Label>
                  <span className={cn("text-[11px]", notesValue.length > NOTES_MAX ? "text-rose-600" : "text-slate-400")}>
                    {notesValue.length}/{NOTES_MAX}
                  </span>
                </div>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Contoh: kontrol kehamilan rutin trimester 3"
                  aria-invalid={!!errors.notes}
                  className={cn(
                    "flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    inputErr(!!errors.notes)
                  )}
                  {...register("notes")}
                />
                <FieldError id="err-notes" message={errors.notes?.message} />
              </div>
            </div>
          </Card>

          {/* Duplikat */}
          {duplicate && (
            <div role="alert" className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 space-y-3">
              <p className="flex gap-2 font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" /> Anda sudah memiliki pendaftaran serupa di perangkat ini
              </p>
              <p className="leading-relaxed">
                No. Booking <strong className="font-mono">{duplicate.noBooking}</strong> — {duplicate.nmPoli},{" "}
                {formatLongDate(duplicate.tanggal)}. Mendaftar ganda pada tanggal yang sama dapat memperlambat verifikasi.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm"><Link to={`/pendaftaran/cek?booking=${duplicate.noBooking}`}>Lihat status pendaftaran</Link></Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    allowDuplicateRef.current = true;
                    handleSubmit(onSubmit)();
                  }}
                >
                  Tetap daftar
                </Button>
              </div>
            </div>
          )}

          {/* Persetujuan + kirim */}
          <Card className="p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#e02875]"
                aria-invalid={!!errors.consent}
                {...register("consent")}
              />
              <div className="space-y-1">
                <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
                  Saya menyatakan data di atas benar dan menyetujui data tersebut digunakan {settings.hospitalName || "RSIA Sayang Ibu"} untuk
                  keperluan pendaftaran serta menghubungi saya terkait jadwal kunjungan.
                </Label>
                <FieldError id="err-consent" message={errors.consent?.message} />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-900">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Pendaftaran sebaiknya dilakukan H-1 sebelum kunjungan. Jadwal dokter dapat berubah sewaktu-waktu dan
                pendaftaran baru <strong>berlaku setelah diverifikasi petugas</strong> (status berubah menjadi “Diterima”).
              </p>
            </div>

            <Button type="submit" className="w-full sm:w-auto sm:px-10 h-12 text-base gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mengirim pendaftaran...
                </>
              ) : (
                "Kirim Pendaftaran"
              )}
            </Button>
          </Card>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <Card className="p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 font-sans">
              <ClipboardCheck className="w-4 h-4 text-primary" /> Alur Pendaftaran
            </h3>
            <ol className="space-y-4">
              {[
                ["Isi formulir", "Lengkapi data pasien dan rencana kunjungan."],
                ["Terima Nomor Booking", "Simpan nomor unik (contoh: BP202609250001)."],
                ["Verifikasi petugas", "Admisi memeriksa data dan kuota dokter."],
                ["Datang & pantau antrean", "Tunjukkan Nomor Booking di loket dan cek posisi antrean secara langsung."],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-5 shadow-sm bg-gradient-to-br from-rose-50 to-white border-rose-100">
            <h3 className="font-bold text-slate-900 mb-1 font-sans">Sudah pernah mendaftar?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">Cek status pendaftaran, nomor antrean hari ini, atau riwayat kunjungan Anda.</p>
            <Button asChild variant="outline" className="w-full gap-2 bg-white">
              <Link to="/pendaftaran/cek"><Search className="w-4 h-4" /> Cek Pendaftaran & Antrean</Link>
            </Button>
          </Card>

          <div className="flex gap-3 text-xs text-slate-500 px-1 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Data Anda hanya digunakan untuk keperluan pendaftaran pelayanan.
              {settings.phoneCs ? <> Butuh bantuan? Hubungi <strong>{settings.phoneCs}</strong>.</> : null}
            </p>
          </div>
        </aside>
      </div>
    </RegistrationShell>
  );
}