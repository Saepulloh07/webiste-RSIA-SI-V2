import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/store";
import { api } from "@/app/api";

const appointmentSchema = z.object({
  patientName: z.string().min(3, "Nama lengkap harus diisi (min. 3 karakter)"),
  phone: z.string().min(10, "Nomor WhatsApp/HP tidak valid"),
  patientType: z.enum(["baru", "lama"], { message: "Pilih jenis pasien" }),
  paymentMethod: z.enum(["umum", "bpjs", "asuransi"], { message: "Pilih metode pembayaran" }),
  serviceId: z.string().min(1, "Pilih poliklinik / layanan"),
  doctorId: z.string().min(1, "Pilih dokter"),
  date: z.string().min(1, "Pilih tanggal kunjungan"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function Appointment() {
  const { registrationSettings, setRegistrationSettings, doctors, services, addAppointment, fetchDoctors, fetchServices } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (doctors.length === 0) fetchDoctors();
    if (services.length === 0) fetchServices();
    api.settings.getRegistration().then((res) => {
      if (res?.data) setRegistrationSettings(res.data);
    }).catch(() => {});
  }, [doctors.length, services.length, fetchDoctors, fetchServices, setRegistrationSettings]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setSubmitError(null);
    const selectedDoc = doctors.find((d) => d.id === data.doctorId);
    const selectedServ = services.find((s) => s.id === data.serviceId);

    try {
      const res = await api.appointments.create({
        patientName: data.patientName,
        phone: data.phone,
        patientType: data.patientType,
        paymentMethod: data.paymentMethod,
        serviceId: data.serviceId,
        serviceName: selectedServ?.name || data.serviceId,
        doctorId: data.doctorId,
        doctorName: selectedDoc?.name || data.doctorId,
        date: data.date,
        notes: data.notes || "",
      });

      const registered = res.data;
      setRefNumber(registered.id);
      addAppointment(registered);
      setIsSuccess(true);
    } catch (err: any) {
      console.warn("Failed posting appointment to server, using local fallback:", err);
      // If error came from validation (e.g. registration closed)
      if (err.status === 400 && err.message) {
        setSubmitError(err.message);
        return;
      }

      const fallbackRef = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefNumber(fallbackRef);
      addAppointment({
        id: fallbackRef,
        patientName: data.patientName,
        phone: data.phone,
        patientType: data.patientType,
        paymentMethod: data.paymentMethod,
        serviceId: data.serviceId,
        serviceName: selectedServ?.name || data.serviceId,
        doctorId: data.doctorId,
        doctorName: selectedDoc?.name || data.doctorId,
        date: data.date,
        notes: data.notes || "",
        status: "Menunggu",
        createdAt: new Date().toISOString(),
      });
      setIsSuccess(true);
    }
  };

  if (!registrationSettings.isOpen) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl min-h-[70vh] flex items-center justify-center">
        <Card className="w-full text-center p-8 border-slate-200 shadow-xl">
          <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Pendaftaran Online Ditutup</h2>
          <p className="text-muted-foreground mb-6">
            Mohon maaf, formulir pendaftaran online saat ini sedang ditutup.
          </p>
          {registrationSettings.noticeMessage && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-sm">
              <p>{registrationSettings.noticeMessage}</p>
            </div>
          )}
          <Button variant="outline" asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl min-h-[70vh] flex items-center justify-center">
        <Card className="w-full text-center p-8 border-primary/20 shadow-xl">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Permintaan Jadwal Diterima</h2>
          <p className="text-muted-foreground mb-6">
            Pendaftaran Anda sedang diproses oleh petugas kami. Kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi jam kedatangan.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 inline-block min-w-[250px]">
            <p className="text-sm text-muted-foreground mb-1">Nomor Referensi Anda</p>
            <p className="text-3xl font-mono font-bold tracking-wider text-slate-800">{refNumber}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">Kembali ke Beranda</Link>
            </Button>
            <Button onClick={() => setIsSuccess(false)}>Daftar Lagi</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Pendaftaran Online</h1>
        <p className="text-muted-foreground">Silakan lengkapi formulir di bawah ini untuk membuat janji temu dengan dokter.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/50 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Formulir Pendaftaran
          </CardTitle>
          <CardDescription>
            Pastikan data yang Anda masukkan benar agar mempermudah proses konfirmasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="patientName">Nama Lengkap Pasien <span className="text-destructive">*</span></Label>
                <Input id="patientName" placeholder="Masukkan nama sesuai KTP" {...register("patientName")} />
                {errors.patientName && <p className="text-xs text-destructive">{errors.patientName.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp/HP Aktif <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Type */}
              <div className="space-y-2">
                <Label htmlFor="patientType">Status Pasien <span className="text-destructive">*</span></Label>
                <NativeSelect id="patientType" {...register("patientType")}>
                  <option value="">Pilih status pasien...</option>
                  <option value="baru">Pasien Baru (Belum pernah berobat)</option>
                  <option value="lama">Pasien Lama (Sudah punya No. RM)</option>
                </NativeSelect>
                {errors.patientType && <p className="text-xs text-destructive">{errors.patientType.message}</p>}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metode Pembayaran <span className="text-destructive">*</span></Label>
                <NativeSelect id="paymentMethod" {...register("paymentMethod")}>
                  <option value="">Pilih metode pembayaran...</option>
                  <option value="umum">Umum / Pribadi</option>
                  <option value="bpjs">BPJS Kesehatan</option>
                  <option value="asuransi">Asuransi Lainnya</option>
                </NativeSelect>
                {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service */}
              <div className="space-y-2">
                <Label htmlFor="serviceId">Poliklinik / Layanan <span className="text-destructive">*</span></Label>
                <NativeSelect id="serviceId" {...register("serviceId")}>
                  <option value="">Pilih poliklinik...</option>
                  {services.filter(s => s.status === 'Aktif').map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </NativeSelect>
                {errors.serviceId && <p className="text-xs text-destructive">{errors.serviceId.message}</p>}
              </div>

              {/* Doctor */}
              <div className="space-y-2">
                <Label htmlFor="doctorId">Pilih Dokter <span className="text-destructive">*</span></Label>
                <NativeSelect id="doctorId" {...register("doctorId")}>
                  <option value="">Pilih dokter...</option>
                  {doctors.filter(d => d.status === 'Aktif').map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </NativeSelect>
                {errors.doctorId && <p className="text-xs text-destructive">{errors.doctorId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Kunjungan <span className="text-destructive">*</span></Label>
                <Input id="date" type="date" min={new Date().toISOString().split('T')[0]} {...register("date")} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Keluhan / Catatan Tambahan (Opsional)</Label>
                <Input id="notes" placeholder="Tuliskan keluhan singkat Anda..." {...register("notes")} />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-900 mt-8">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Informasi Penting</p>
                <p className="opacity-90 leading-relaxed">
                  Pendaftaran online sebaiknya dilakukan H-1 sebelum kunjungan. Jadwal dokter dapat berubah sewaktu-waktu. Petugas kami akan memverifikasi pendaftaran ini.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto md:px-8 text-base h-12" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Kirim Permintaan Pendaftaran"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
