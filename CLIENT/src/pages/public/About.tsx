import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, ShieldCheck, HeartPulse, Sparkles, Award, Users } from "lucide-react";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";

export default function About() {
  const { settings, media } = useStore();
  const hospitalImage = media.find(m => m.type === 'website_image' && m.name === 'hero-banner') ||
    media.find(m => m.type === 'website_image') ||
    { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop' };

  return (
    <div className="pb-20 bg-gradient-to-b from-rose-50/30 via-white to-amber-50/20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Profil Resmi Rumah Sakit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Tentang {settings.hospitalName || "RSIA Sayang Ibu"}
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {settings.slogan || "Mengenal lebih dekat dedikasi dan komitmen kami dalam menghadirkan pelayanan kesehatan keluarga yang paripurna."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-14 relative z-10 max-w-5xl">
        {/* Hospital Visual Banner with Watermark */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/8] md:aspect-[21/9] relative bg-slate-100">
          <img
            src={hospitalImage.url}
            alt={settings.hospitalName || "Gedung RSIA Sayang Ibu"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

          {/* Proportional Watermark on Hospital Image */}
          <MediaWatermark size="lg" />

          <div className="absolute bottom-4 left-6 text-white">
            <h3 className="text-xl md:text-2xl font-bold font-heading">{settings.hospitalName}</h3>
            <p className="text-xs md:text-sm text-slate-200">{settings.address || "Batusangkar, Sumatera Barat"}</p>
          </div>
        </div>

        <Card className="shadow-xl border border-amber-100 mb-12 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl font-bold font-heading mb-4 text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-gradient-to-b from-primary to-amber-500 rounded-full inline-block"></span>
              Sejarah & Profil Rumah Sakit
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 text-base">
              <p>
                {settings.aboutText || `${settings.hospitalName || "RSIA Sayang Ibu Batusangkar"} telah menjadi pusat rujukan utama untuk kesehatan keluarga di wilayah Batusangkar dan sekitarnya.`}
              </p>
              <p>
                Kami memadukan keahlian tenaga dokter spesialis berpengalaman, perawat dan bidan yang berdedikasi tinggi, teknologi medis diagnostik modern (seperti USG 4D Fetomaternal dan metode operasi ERACS), serta sentuhan empati keluarga untuk memberikan pengalaman perawatan yang aman, nyaman, dan menenangkan.
              </p>
              <p>
                Fokus utama kami adalah menghadirkan layanan spesialis kebidanan, kandungan, dan anak dengan standar mutu tinggi yang berorientasi pada keselamatan pasien (Patient Safety).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-md border border-amber-100 hover:border-amber-300 transition-all rounded-3xl bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading mb-3 text-slate-900">Visi Kami</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Menjadi Rumah Sakit keluarga pilihan utama dan terpercaya yang memberikan pelayanan kesehatan berkualitas prima, modern, dan humanis di wilayah Sumatera Barat.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border border-amber-100 hover:border-amber-300 transition-all rounded-3xl bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading mb-3 text-slate-900">Misi Kami</h2>
              <ul className="space-y-3 text-slate-600 text-sm md:text-base">
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>Memberikan pelayanan kesehatan keluarga yang paripurna dan profesional.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Meningkatkan mutu kompetensi sumber daya manusia secara berkesinambungan.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Menyediakan fasilitas dan peralatan medis yang modern, aman, dan nyaman.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Nilai-nilai Inti */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-8 text-center text-slate-900">Nilai-Nilai Dasar (Core Values)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-amber-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-rose-50 text-primary rounded-2xl flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-heading mb-1.5 text-slate-900">Empati & Kasih</h3>
              <p className="text-xs text-slate-600">Melayani dengan tulus dan penuh kasih sayang layaknya keluarga sendiri.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-heading mb-1.5 text-slate-900">Integritas</h3>
              <p className="text-xs text-slate-600">Menjunjung tinggi etika kedokteran, kejujuran, dan transparansi pelayanan.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-heading mb-1.5 text-slate-900">Keunggulan</h3>
              <p className="text-xs text-slate-600">Terus berinovasi dan meningkatkan standar mutu klinis serta teknologi.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-heading mb-1.5 text-slate-900">Kerjasama</h3>
              <p className="text-xs text-slate-600">Kolaborasi solid antardisiplin medis demi keselamatan pasien seutuhnya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

