import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Stethoscope, AlertTriangle, ChevronRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useStore } from "@/store";

export default function PatientInfo() {
  const { settings } = useStore();

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Panduan & Tata Tertib Pasien</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">Informasi Pasien</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Panduan menyeluruh prosedur pendaftaran, jam kunjungan, dan alur pelayanan di {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Jam Pelayanan */}
          <Card className="shadow-lg border border-amber-100 rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-rose-50/30 border-b border-amber-100/60 p-6">
              <CardTitle className="flex items-center gap-2.5 text-lg font-bold font-heading text-slate-900">
                <Clock className="w-5 h-5 text-primary" />
                Jadwal & Jam Pelayanan Unit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-semibold text-xs md:text-sm text-slate-800">Instalasi Gawat Darurat (IGD)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">24 Jam Siaga</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-semibold text-xs md:text-sm text-slate-800">Poliklinik Rawat Jalan</span>
                  <span className="text-slate-600 text-xs text-right">08:00 - 20:00 WIB<br/>(Sesuai Jadwal Dokter)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-semibold text-xs md:text-sm text-slate-800">Laboratorium & Diagnostik</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">24 Jam</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-semibold text-xs md:text-sm text-slate-800">Instalasi Farmasi / Apotek</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">24 Jam</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <div>
                    <span className="font-semibold text-xs md:text-sm text-slate-800 block">Jam Besuk Rawat Inap</span>
                    <span className="text-[11px] text-slate-500">Maks. 2 pengunjung bergantian</span>
                  </div>
                  <div className="text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl text-xs font-semibold text-right border border-amber-200">
                    Siang: 11.00 - 13.00<br/>Sore: 17.00 - 19.30
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Persyaratan Pendaftaran */}
          <Card className="shadow-lg border border-amber-100 rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-rose-50/30 border-b border-amber-100/60 p-6">
              <CardTitle className="flex items-center gap-2.5 text-lg font-bold font-heading text-slate-900">
                <FileText className="w-5 h-5 text-amber-600" />
                Persyaratan Berkas Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Pasien Mandiri / Umum
                  </h4>
                  <ul className="text-xs text-slate-600 ml-5 space-y-1.5 list-disc">
                    <li>Kartu Tanda Penduduk (KTP) / KIA / Akta Kelahiran asli</li>
                    <li>Kartu Berobat RSIA Sayang Ibu (bila pasien lama)</li>
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                    Pasien BPJS Kesehatan & Asuransi
                  </h4>
                  <ul className="text-xs text-slate-600 ml-5 space-y-1.5 list-disc">
                    <li>Kartu Kepesertaan BPJS / Asuransi aktif (asli / digital)</li>
                    <li>Surat Rujukan dari Faskes Tingkat 1 (Puskesmas/Klinik Pratama)</li>
                    <li>Kartu Identitas KTP & Kartu Keluarga (KK)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-3.5 rounded-2xl border border-rose-200 text-rose-900 text-xs flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-bold">Ketentuan Gawat Darurat (IGD):</strong> Pasien dengan kondisi kegawatdaruratan medis langsung dilayani di IGD tanpa mensyaratkan surat rujukan terlebih dahulu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alur Pelayanan Rawat Jalan */}
          <Card className="shadow-lg border border-amber-100 rounded-3xl bg-white overflow-hidden md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-rose-50/30 border-b border-amber-100/60 p-6">
              <CardTitle className="flex items-center gap-2.5 text-lg font-bold font-heading text-slate-900">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Alur Praktis Pelayanan Poliklinik & Rawat Jalan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 border border-amber-100/80 rounded-2xl bg-gradient-to-b from-white to-rose-50/30 shadow-sm relative pt-7 text-center">
                  <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-sm">1</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">Registrasi & Antrean</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Melalui website online atau mesin pendaftaran mandiri di lobi utama.</p>
                </div>
                <div className="p-5 border border-amber-100/80 rounded-2xl bg-gradient-to-b from-white to-rose-50/30 shadow-sm relative pt-7 text-center">
                  <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xs absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-sm">2</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">Skrining Tanda Vital</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Pemeriksaan tensi darah, penimbangan berat badan, dan observasi awal.</p>
                </div>
                <div className="p-5 border border-amber-100/80 rounded-2xl bg-gradient-to-b from-white to-rose-50/30 shadow-sm relative pt-7 text-center">
                  <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-sm">3</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">Konsultasi Dokter</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Pemeriksaan USG/klinis dan penegakan diagnosis oleh dokter spesialis.</p>
                </div>
                <div className="p-5 border border-amber-100/80 rounded-2xl bg-gradient-to-b from-white to-rose-50/30 shadow-sm relative pt-7 text-center">
                  <div className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-xs absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-sm">4</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">Farmasi & Administrasi</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Pengambilan resep obat terstandar serta penyelesaian jaminan pembayaran.</p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <p className="text-xs text-slate-600">
                    Semua alur pelayanan dijamin menerapkan standar mutu keselamatan pasien dan protokol higienitas tinggi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

