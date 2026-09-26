import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, HeartPulse, Activity, Baby, Clock, CheckCircle2, Calendar, Stethoscope, Sparkles } from "lucide-react";
import { useStore, Service } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/app/api";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { services, doctors, settings } = useStore();
  const [fetchedService, setFetchedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const service = services.find(s => s.slug === slug || s.id === slug) || fetchedService;

  useEffect(() => {
    if (!services.find(s => s.slug === slug || s.id === slug) && slug) {
      setIsLoading(true);
      api.services.getOne(slug)
        .then((res) => {
          if (res?.data) setFetchedService(res.data);
        })
        .catch(() => { })
        .finally(() => setIsLoading(false));
    }
  }, [services, slug]);

  if (isLoading && !service) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Memuat informasi layanan...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-800">Layanan Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8 text-sm">Maaf, informasi layanan medis yang Anda cari belum tersedia atau telah dipindahkan.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6">
          <Link to="/layanan">Kembali ke Daftar Layanan</Link>
        </Button>
      </div>
    );
  }

  // Find doctors related to this service
  const relatedDoctors = doctors.filter(doc => {
    const sName = service.name.toLowerCase();
    const docSpec = doc.specialty.toLowerCase();
    if (sName.includes("kandungan") && docSpec.includes("kandungan")) return true;
    if (sName.includes("anak") && docSpec.includes("anak")) return true;
    return true; // default list
  });

  const getServiceFacilities = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("kandungan")) {
      return [
        "Pemeriksaan USG 2D/3D/4D Fetomaternal",
        "Kamar Bersalin (VK) Standar Rumah Sakit Ibu & Anak",
        "Persalinan Normal & Operasi Caesar (Metode ERACS)",
        "Konsultasi Program Hamil & Kesehatan Reproduksi",
        "Skrining Kelainan Kongenital Trimester Awal"
      ];
    }
    if (n.includes("anak")) {
      return [
        "Poli Tumbuh Kembang & Nutrisi Anak",
        "Imunisasi Dasar Lengkap & Vaksinasi Tambahan",
        "Perawatan Intensif Perinatologi & Inkubator",
        "Kamar Rawat Inap Khusus Anak Ramah Balita",
        "Konsultasi Alergi dan Saluran Cerna Anak"
      ];
    }
    if (n.includes("laboratorium")) {
      return [
        "Pemeriksaan Darah Lengkap Otomatis",
        "Tes Hormon Kehamilan & Skrining Torch",
        "Pemeriksaan Urine Rutin & Kimia Darah",
        "Layanan Laboratorium Siaga 24 Jam Penuh"
      ];
    }
    return [
      "Penanganan Cepat Tim Dokter & Paramedis Berpengalaman",
      "Peralatan Medis Modern dan Higienis",
      "Integrasi Rekam Medis Pasien Terpadu",
      "Layanan Farmasi & Obat Resep Tersedia 24 Jam"
    ];
  };

  const facilities = (service.facilities && service.facilities.length > 0)
    ? service.facilities
    : getServiceFacilities(service.name);

  return (
    <div className="bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-12 pb-24 md:pt-16 md:pb-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/layanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-xs md:text-sm font-semibold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Layanan
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md">
              {service.category || "Layanan Spesialis"}
            </Badge>
            {service.operationalHours && (
              <Badge className="bg-amber-400/30 text-amber-100 border-amber-300/40">
                <Clock className="w-3 h-3 mr-1" /> {service.operationalHours}
              </Badge>
            )}
            <div className="inline-flex items-center gap-1 text-xs text-amber-200 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Akreditasi Rumah Sakit</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-white tracking-tight">
            {service.name}
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20 max-w-5xl">
        {/* Service Hero Image with Watermark */}
        {service.image && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[21/9] md:aspect-[24/9] relative bg-slate-100">
            <img
              src={service.image}
              alt={service.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Proportional Watermark */}
            <MediaWatermark size="md" />

            <div className="absolute bottom-4 left-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Unit Medis Unggulan</span>
              <h3 className="text-xl md:text-2xl font-bold font-heading">{service.name}</h3>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-amber-100 flex flex-col md:flex-row gap-8 md:gap-12">

          {/* Facilities List */}
          <div className="flex-1">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-gradient-to-b from-primary to-amber-500 rounded-full inline-block"></span>
              Fasilitas & Tindakan Medis
            </h3>
            <ul className="space-y-4">
              {facilities.map((fac, idx) => (
                <li key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/40 border border-amber-100/60">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                  <span className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">{fac}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-amber-100"></div>
          <div className="md:hidden h-px bg-amber-100 w-full"></div>

          {/* Doctors List & CTA */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-gradient-to-b from-amber-500 to-emerald-500 rounded-full inline-block"></span>
              Tim Dokter Terkait
            </h3>
            <ul className="space-y-3 mb-8">
              {relatedDoctors.slice(0, 3).map((doc) => (
                <li key={doc.id}>
                  <Link
                    to={`/dokter/${doc.slug || doc.id}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-rose-50/50 transition-all border border-amber-100 hover:border-amber-300 group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-primary shrink-0">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm md:text-base group-hover:text-primary transition-colors block leading-tight">
                          {doc.name}
                        </span>
                        <span className="text-xs text-slate-500">Spesialis {doc.specialty}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto bg-gradient-to-br from-rose-50 via-amber-50/50 to-emerald-50/30 p-6 rounded-3xl border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <span className="font-bold text-slate-900 text-base">Pendaftaran Janji Temu</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 mb-5 leading-relaxed">
                Pilih dokter spesialis dan waktu konsultasi secara fleksibel melalui sistem pendaftaran online {settings.hospitalName || "RSIA Sayang Ibu"}.
              </p>
              <Link
                to="/pendaftaran"
                className="flex items-center justify-center w-full bg-gradient-to-r from-primary to-amber-600 text-white py-3 rounded-xl font-bold text-sm hover:from-primary/90 hover:to-amber-600/90 transition-all shadow-md shadow-primary/20"
              >
                Daftar Janji Temu Sekarang
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

