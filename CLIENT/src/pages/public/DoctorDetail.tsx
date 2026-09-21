import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, GraduationCap, MapPin, Stethoscope, Sparkles, Award, Phone } from "lucide-react";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { SEOHead } from "@/components/common/SEOHead";

export default function DoctorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { doctors, settings } = useStore();

  const doctor = doctors.find(d => d.slug === slug || d.id === slug) || doctors[0];

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-800">Dokter Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8 text-sm">Maaf, profil dokter yang Anda cari belum terdaftar di sistem kami.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6">
          <Link to="/dokter">Kembali ke Direktori Dokter</Link>
        </Button>
      </div>
    );
  }

  const doctorImage = doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80";

  const doctorSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": doctor.name,
    "image": doctorImage,
    "medicalSpecialty": doctor.specialty,
    "worksFor": {
      "@type": "Hospital",
      "name": "RSIA Sayang Ibu Batusangkar"
    },
    "description": `Dokter Spesialis ${doctor.specialty} dengan jadwal praktek ${doctor.schedule} di RSIA Sayang Ibu Batusangkar.`
  };

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      <SEOHead
        title={`${doctor.name} - ${doctor.specialty} | RSIA Sayang Ibu Batusangkar`}
        description={`Jadwal praktek & profil ${doctor.name}, ${doctor.specialty} di RSIA Sayang Ibu Batusangkar Tanah Datar. Buat janji temu konsultasi sekarang.`}
        keywords={`jadwal dokter ${doctor.name.toLowerCase()}, ${doctor.specialty.toLowerCase()} batusangkar, dokter kandungan batusangkar, jadwal praktek dokter rsia sayang ibu`}
        ogType="profile"
        ogImage={doctorImage}
        schemaData={doctorSchema}
      />
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-10 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link
            to="/dokter"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 text-xs md:text-sm font-semibold bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Direktori Dokter
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Card with Watermark */}
          <div className="md:col-span-1">
            <Card className="shadow-xl border border-amber-100 rounded-3xl overflow-hidden bg-white sticky top-24">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                <img
                  src={doctorImage}
                  alt={doctor.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>

                {/* Proportional Watermark on Doctor Photo */}
                <MediaWatermark size="sm" />

                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-white/95 text-emerald-700 backdrop-blur-sm border border-amber-200/50 shadow-sm text-xs font-semibold px-2.5 py-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {doctor.status || "Aktif"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 text-primary border border-rose-100 text-xs font-bold mb-3">
                  Spesialis {doctor.specialty}
                </div>
                <h1 className="text-xl md:text-2xl font-bold font-heading mb-1 text-slate-900 leading-snug">
                  {doctor.name}
                </h1>

                {doctor.subspecialty && (
                  <p className="text-xs text-primary font-semibold mb-2">
                    {doctor.subspecialty}
                  </p>
                )}

                <p className="text-amber-700 font-semibold text-xs md:text-sm mb-4 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}</span>
                </p>

                {(doctor.sipNumber || doctor.poliklinik) && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-6 text-left space-y-1.5 text-xs text-slate-600">
                    {doctor.sipNumber && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-800 shrink-0">SIP:</span>
                        <span className="break-all">{doctor.sipNumber}</span>
                      </div>
                    )}
                    {doctor.poliklinik && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-800 shrink-0">Poli:</span>
                        <span>{doctor.poliklinik}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white font-bold shadow-md shadow-primary/20"
                  asChild
                >
                  <Link to={`/pendaftaran?dokter=${encodeURIComponent(doctor.name)}`}>
                    Buat Janji Konsultasi
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md border border-amber-100 rounded-3xl bg-white">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2 text-slate-900">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Profil & Dedikasi Klinis
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {doctor.bio || `${doctor.name} merupakan dokter spesialis ${doctor.specialty.toLowerCase()} yang berdedikasi dalam memberikan pelayanan kesehatan terbaik untuk keluarga di ${settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}. Berkomitmen penuh mengutamakan keselamatan pasien, pendekatan humanis, dan komunikasi medis yang transparan.`}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-amber-100 rounded-3xl bg-white">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2 text-slate-900">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Jadwal Praktik Poliklinik
                </h2>
                <div className="bg-gradient-to-br from-amber-50/60 to-rose-50/40 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm md:text-base">{doctor.schedule}</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      * Jadwal dapat disesuaikan pada hari libur nasional atau tindakan operasi darurat. Konfirmasi kedatangan Anda secara instan melalui sistem pendaftaran online.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-amber-100 rounded-3xl bg-white">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold font-heading mb-4 flex items-center gap-2 text-slate-900">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Pendidikan & Kompetensi
                </h2>
                <ul className="space-y-3.5">
                  {doctor.education && doctor.education.length > 0 ? (
                    doctor.education.map((edu, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">{edu}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">Program Pendidikan Dokter Spesialis (PPDS) {doctor.specialty}</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">Pendidikan Profesi Kedokteran Terakreditasi Nasional</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">Anggota Aktif Ikatan Dokter Indonesia (IDI) & Perhimpunan Spesialis Terkait</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Contact & Emergency Notice */}
            <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900">Layanan Informasi Pendaftaran</h4>
                  <p className="text-[11px] text-slate-500">Hubungi call center resmi kami di {settings.phoneCs || "(0752) 123456"}</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${(settings.whatsapp || "").replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
              >
                Chat WA
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

