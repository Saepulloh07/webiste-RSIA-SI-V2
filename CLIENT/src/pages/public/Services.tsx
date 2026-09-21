import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Stethoscope, HeartPulse, Baby, Microscope, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { MediaWatermark } from "@/components/common/MediaWatermark";

export default function Services() {
  const { services, settings } = useStore();
  const activeServices = services.filter(s => s.status === "Aktif");

  const getServiceIcon = (category: string, name: string) => {
    const text = (category + " " + name).toLowerCase();
    if (text.includes("kandungan") || text.includes("obgyn")) return <HeartPulse className="w-6 h-6 text-primary" />;
    if (text.includes("anak") || text.includes("pediatri")) return <Baby className="w-6 h-6 text-amber-700" />;
    if (text.includes("laboratorium") || text.includes("lab")) return <Microscope className="w-6 h-6 text-emerald-700" />;
    if (text.includes("igd") || text.includes("darurat")) return <Activity className="w-6 h-6 text-red-600" />;
    return <Stethoscope className="w-6 h-6 text-primary" />;
  };

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Layanan Medis Terpadu</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Layanan Unggulan Medis
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {settings.hospitalName || "RSIA Sayang Ibu"} menghadirkan layanan spesialis, fasilitas penunjang modern, dan perawatan berpusat pada keselamatan dan kenyamanan pasien.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group flex flex-col"
            >
              {/* Image & Watermark */}
              <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                <img
                  src={service.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop"}
                  alt={service.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                {/* Proportional Watermark */}
                <MediaWatermark size="sm" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/95 text-slate-800 backdrop-blur-sm border border-amber-200/50 shadow-sm text-xs font-semibold px-3 py-1">
                    {service.category || "Poliklinik"}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    {getServiceIcon(service.category, service.name)}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-primary transition-colors leading-snug">
                    {service.name}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <Link
                    to={`/layanan/${service.slug || service.id}`}
                    className="inline-flex items-center text-xs md:text-sm font-bold text-amber-700 group-hover:text-primary transition-colors"
                  >
                    Detail & Jadwal <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/pendaftaran"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
