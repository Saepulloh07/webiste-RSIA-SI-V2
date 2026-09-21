import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";

export default function Facilities() {
  const { settings, services } = useStore();
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", "Pelayanan", "Rawat Inap", "Penunjang Medis", "Umum"];

  // Dynamically aggregate facilities from registered hospital services
  const facilitiesList = services.flatMap((service) => 
    (service.facilities || []).map((facilityName, idx) => ({
      id: `${service.id}-${idx}`,
      name: facilityName,
      category: service.category || "Pelayanan",
      image: service.image || "",
      serviceName: service.name,
      description: `Fasilitas penunjang terstandarisasi untuk ${service.name} di ${settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}.`
    }))
  );

  const filteredFacilities = filter === "Semua"
    ? facilitiesList
    : facilitiesList.filter(f => f.category === filter);

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
              className={`px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                filter === category
                  ? "bg-gradient-to-r from-primary to-amber-600 text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredFacilities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-100/80 shadow-xs p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <Building2 className="w-8 h-8 text-amber-600/70" />
            </div>
            <h3 className="text-lg font-bold font-heading mb-1 text-slate-800">Belum Ada Fasilitas Terdaftar</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
              {filter !== "Semua" 
                ? `Tidak ada fasilitas untuk kategori "${filter}". Silakan pilih kategori lain.`
                : "Informasi fasilitas dan sarana medis sedang diperbarui oleh manajemen rumah sakit."}
            </p>
          </div>
        ) : (
          /* Facilities Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredFacilities.map(facility => (
              <div
                key={facility.id}
                className="bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group flex flex-col"
              >
                {facility.image && (
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
                )}

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
        )}
      </div>
    </div>
  );
}
