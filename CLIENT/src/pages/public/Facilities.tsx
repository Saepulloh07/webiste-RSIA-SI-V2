import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";

const defaultFacilitiesData = [
  {
    id: 1,
    name: "Instalasi Gawat Darurat (IGD) Maternal & Neonatal",
    category: "Pelayanan",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    description: "Siaga 24 jam dengan tim dokter umum, bidan terlatih, dan dokter spesialis on-call untuk penanganan gawat darurat ibu dan bayi."
  },
  {
    id: 2,
    name: "Ruang Operasi Modern (OK) & Bedah ERACS",
    category: "Pelayanan",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    description: "Dilengkapi teknologi anestesi mutakhir dan sistem HEPA filter berstandar internasional untuk persalinan caesar metode ERACS yang minim nyeri."
  },
  {
    id: 3,
    name: "Ruang Rawat Inap VIP & Suite Room",
    category: "Rawat Inap",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    description: "Kamar perawatan privat bernuansa hotel mewah dan tenang dengan sofa penunggu, smart TV, kulkas, dan kamar mandi hangat."
  },
  {
    id: 4,
    name: "Ruang Rawat Inap Anak Ramah Balita",
    category: "Rawat Inap",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    description: "Didesain dengan interior ceria dan penuh warna untuk mengurangi kecemasan si kecil selama masa pemulihan."
  },
  {
    id: 5,
    name: "Laboratorium Patologi & Darah 24 Jam",
    category: "Penunjang Medis",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
    description: "Analisis cepat, akurat, dan terstandarisasi untuk tes skrining kehamilan, hematologi anak, dan kimia darah."
  },
  {
    id: 6,
    name: "Instalasi Farmasi & Apotek Ramah Pasien",
    category: "Penunjang Medis",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80",
    description: "Penyediaan obat resep asli khusus ibu hamil, menyusui, serta suplemen vitamin anak dengan konsultasi apoteker profesional."
  },
  {
    id: 7,
    name: "Ruang USG 4D HD-Live Fetomaternal",
    category: "Pelayanan",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80",
    description: "Pencitraan janin real-time ultra tajam untuk melihat detail ekspresi dan deteksi dini anatomi janin bersama dokter spesialis."
  },
  {
    id: 8,
    name: "Taman Edukasi & Area Bermain Anak",
    category: "Umum",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop&q=80",
    description: "Ruang tunggu anak yang aman dan higienis dengan mainan terdisinfeksi secara berkala agar anak tetap ceria saat menunggu konsultasi."
  },
];

export default function Facilities() {
  const { settings } = useStore();
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", "Pelayanan", "Rawat Inap", "Penunjang Medis", "Umum"];

  const filteredFacilities = filter === "Semua"
    ? defaultFacilitiesData
    : defaultFacilitiesData.filter(f => f.category === filter);

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fasilitas Medis Modern</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Fasilitas {settings.hospitalName || "RSIA Sayang Ibu"}
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Kenyamanan dan keamanan masa perawatan keluarga adalah prioritas utama dengan dukungan sarana medis terstandarisasi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
        {/* Category Filter Pills */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-lg border border-amber-100 p-2 md:p-3 flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${filter === category
                  ? "bg-gradient-to-r from-primary to-amber-600 text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-800"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredFacilities.map(facility => (
            <div
              key={facility.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Proportional Watermark on every facility card */}
                <MediaWatermark size="sm" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/95 text-primary backdrop-blur-sm border border-amber-200/60 shadow-sm text-xs font-semibold px-3 py-1">
                    {facility.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {facility.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-auto">
                  {facility.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Tersertifikasi & Higienis Terjaga</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

