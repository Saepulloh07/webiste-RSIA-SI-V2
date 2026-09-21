import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight, Stethoscope, Clock, ShieldCheck,
  Activity, Baby, HeartPulse, MapPin,
  Phone, Mail, Calendar, Play, Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { SEOHead } from "@/components/common/SEOHead";

export default function Home() {
  const { articles, settings, media, services, doctors } = useStore();
  const publishedArticles = articles.filter(a => a.status === 'Published').slice(0, 3);
  const activeDoctors = doctors.filter(d => d.status === 'Aktif').slice(0, 4);
  const displayServices = (services || []).filter(s => s.status === 'Aktif').slice(0, 3);

  const heroImage = media.find(m => m.type === 'website_image' && m.name === 'hero-banner') ||
    media.find(m => m.type === 'website_image') ||
    { url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop' };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      <SEOHead
        title="RSIA Sayang Ibu Batusangkar | Rumah Sakit Ibu & Anak Terdepan di Tanah Datar"
        description="RSIA Sayang Ibu Batusangkar menyediakan layanan persalinan metode ERACS, USG 4D fetomaternal, dokter spesialis kandungan (Sp.OG), spesialis anak (Sp.A), dan IGD 24 jam di Kabupaten Tanah Datar."
        keywords="rsia sayang ibu, rsia sayang ibu batusangkar, rumah sakit bersalin batusangkar, dokter kandungan batusangkar, dokter anak batusangkar, persalinan eracs tanah datar, usg 4d batusangkar, igd 24 jam batusangkar"
        ogType="website"
      />
      {/* Premium Hero Section */}
      <section className="relative pt-16 pb-28 md:pt-20 md:pb-32 lg:pt-28 lg:pb-40 overflow-hidden bg-gradient-to-b from-rose-50/40 via-amber-50/20 to-transparent">
        {/* Soft Ambient Gradients (Pink, Gold, Light Green) */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-tertiary/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-amber-200/20 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-200/90 text-amber-800 text-[11px] md:text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                <span>{settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-[1.15] mb-4 md:mb-6 text-slate-900 tracking-tight">
                Pelayanan Medis <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent italic font-serif">
                  Sepenuh Hati
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {settings.aboutText || settings.slogan || "Pusat rujukan terdepan untuk kesehatan Ibu dan Anak dengan pelayanan paripurna, ramah, dan profesional di Batusangkar."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full px-4 sm:px-0">
                <Link to="/pendaftaran" className="w-full sm:w-auto group relative inline-flex items-center justify-center px-7 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white rounded-full font-bold text-base md:text-lg overflow-hidden transition-all hover:shadow-[0_10px_30px_rgba(225,29,72,0.35)] hover:scale-[1.02]">
                  <span className="relative flex items-center gap-2">
                    Buat Janji Online <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/dokter" className="w-full sm:w-auto inline-flex items-center justify-center px-7 md:px-8 py-3.5 md:py-4 bg-white/95 text-slate-800 border border-amber-200/80 rounded-full font-bold text-base md:text-lg hover:bg-amber-50/60 hover:border-amber-300 transition-all shadow-sm">
                  Cari Jadwal Dokter
                </Link>
              </div>

              {/* Mini Highlights */}
              <div className="mt-10 pt-6 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>IGD 24 Jam Siaga</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Metode ERACS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>USG 4D Fetomaternal</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Banner with Proportional Watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative mx-auto lg:ml-auto w-full max-w-[320px] sm:max-w-md lg:max-w-none aspect-[4/5] lg:aspect-square mt-6 lg:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-amber-100 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-10 flex items-center justify-center">
                <img
                  src={heroImage.url}
                  alt="RSIA Sayang Ibu"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>

                {/* Proportional Logo Watermark */}
                <MediaWatermark size="lg" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-left-6 md:-left-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 md:p-5 rounded-2xl shadow-xl border border-amber-200/80 z-20 flex items-center gap-3 md:gap-4 max-w-[220px] sm:max-w-none"
              >
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">10.000+</p>
                  <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">Pasien Terlayani</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Action Bento Grid */}
      <section className="relative z-20 -mt-10 md:-mt-16 container mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          <motion.div variants={itemVariants}>
            <Link to="/dokter" className="block h-full group">
              <Card className="h-full border border-amber-100/80 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl hover:border-amber-300">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-rose-100">
                    <Stethoscope className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg md:text-xl mb-1 md:mb-2 text-slate-800 group-hover:text-primary transition-colors">Cari Jadwal Dokter</h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Temukan jadwal praktik dokter spesialis kandungan dan anak terpercaya.</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/layanan" className="block h-full group">
              <Card className="h-full border border-amber-100/80 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl hover:border-amber-300">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                    <Activity className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg md:text-xl mb-1 md:mb-2 text-slate-800 group-hover:text-emerald-700 transition-colors">Layanan Unggulan</h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Fasilitas persalinan ERACS, ruang bersalin privat, IGD 24 Jam, dan poli anak.</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-2 md:col-span-1">
            <Link to="/pendaftaran" className="block h-full group">
              <Card className="h-full border-0 shadow-lg shadow-amber-500/15 transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 via-rose-600 to-primary text-white relative">
                <div className="absolute inset-0 bg-gradient-to-tl from-primary to-amber-500 w-0 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-3 md:gap-4 relative z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg md:text-xl mb-1 md:mb-2 text-white">Pendaftaran Online</h3>
                    <p className="text-white/90 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">Daftar pemeriksaan secara digital tanpa antre panjang di loket.</p>
                    <span className="inline-flex items-center text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                      Daftar Sekarang <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Snippet section (Dynamic from CMS) */}
      <section className="py-16 md:py-24 relative bg-gradient-to-b from-transparent via-rose-50/20 to-transparent">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-widest mb-2 md:mb-3">Layanan Kami</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-slate-900 mb-4 md:mb-6 leading-tight">
              Fokus pada Kesehatan <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-600 via-primary to-rose-600 bg-clip-text text-transparent font-serif italic">
                Keluarga Anda
              </span>
            </h3>
            <p className="text-sm md:text-lg text-slate-600 px-4 sm:px-0">
              Pelayanan komprehensif yang didukung oleh dokter berpengalaman, teknologi modern, dan sentuhan kehangatan keluarga.
            </p>
          </div>

          {displayServices.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md mx-auto border border-amber-100/80 shadow-xs">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">Informasi layanan medis sedang diperbarui.</p>
              <p className="text-slate-400 text-xs mt-1">Silakan hubungi customer service kami untuk informasi jadwal poliklinik.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayServices.map((service, index) => {
              const borderColors = [
                "hover:border-rose-300",
                "hover:border-amber-300",
                "hover:border-emerald-300"
              ];
              const badgeColors = [
                "text-primary bg-rose-50",
                "text-amber-700 bg-amber-50",
                "text-emerald-700 bg-emerald-50"
              ];
              return (
                <div
                  key={service.id || index}
                  className={`group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 ${borderColors[index % 3]} hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    <div className="aspect-[16/10] bg-gradient-to-tr from-rose-50 to-amber-50 rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center">
                      {index === 0 && <HeartPulse className="w-16 h-16 text-primary/30" />}
                      {index === 1 && <Baby className="w-16 h-16 text-amber-600/30" />}
                      {index === 2 && <Activity className="w-16 h-16 text-emerald-600/30" />}

                      <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${badgeColors[index % 3]} z-10`}>
                        {index === 0 && <HeartPulse className="w-5 h-5" />}
                        {index === 1 && <Baby className="w-5 h-5" />}
                        {index === 2 && <Activity className="w-5 h-5" />}
                      </div>

                      {/* Proportional Watermark */}
                      <MediaWatermark size="sm" />
                    </div>

                    <h4 className="text-lg md:text-xl font-bold font-heading text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                      {service.description || "Layanan terpadu dengan standar medis tertinggi untuk pasien."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link to={`/layanan/${service.slug || service.id}`} className="inline-flex items-center text-primary font-bold hover:text-amber-700 transition-colors text-xs md:text-sm">
                      Detail Layanan <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Doctors Section (Dynamic from CMS) */}
      {activeDoctors.length > 0 && (
        <section className="py-16 md:py-24 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-[11px] md:text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Tim Medis</h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-2">
                  Dokter Spesialis Kami
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Tenaga medis profesional yang siap mendampingi perjalanan kesehatan Anda dan keluarga.
                </p>
              </div>
              <Link to="/dokter" className="inline-flex items-center text-primary hover:text-amber-700 font-bold text-sm">
                Lihat Semua Dokter <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* YouTube Video Section with Proportional Watermark */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary/15 to-transparent opacity-60"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-[11px] md:text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 md:mb-3">Mengenal Kami</h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-8 md:mb-12">Tur Fasilitas & Edukasi Medis</h3>

          <div className="max-w-5xl mx-auto aspect-video bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden group border border-amber-500/20">
            {/* Thumbnail with Proportional Watermark on Top-Right */}
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
              alt="Hospital Tour Video"
              loading="lazy"
              decoding="async"
            />

            {/* Proportional Hospital Watermark on Video */}
            <MediaWatermark size="lg" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                aria-label="Putar Video Company Profile"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-[0_0_40px_rgba(225,29,72,0.5)] border border-white/30"
              >
                <Play className="w-6 h-6 md:w-10 md:h-10 text-white fill-white ml-1 md:ml-2" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-left">
              <p className="text-base sm:text-lg md:text-xl font-bold font-heading text-white line-clamp-1">
                Company Profile {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}
              </p>
              <p className="text-xs md:text-sm text-slate-300 mt-1">Official Video Profil & Fasilitas Layanan Medis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section (Dynamic from CMS) */}
      {publishedArticles.length > 0 && (
        <section className="py-16 md:py-24 relative bg-rose-50/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-widest mb-2 md:mb-3">Berita & Edukasi</h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-3 md:mb-4 text-slate-900">
                  Artikel & Informasi Kesehatan
                </h3>
                <p className="text-sm md:text-base text-slate-600">Informasi dan tips kesehatan terkini langsung dari pakar medis kami.</p>
              </div>
              <Link to="/artikel" className="inline-flex items-center text-white bg-primary px-6 py-3 rounded-full font-bold text-sm md:text-base hover:bg-primary-hover hover:shadow-lg transition-all w-full md:w-auto justify-center">
                Semua Artikel <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {publishedArticles.map((article) => (
                <Link to={`/artikel/${article.slug}`} key={article.id} className="group flex flex-col bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-amber-100/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-primary shadow-sm border border-amber-200/50">
                      {article.category}
                    </div>

                    {/* Proportional Watermark */}
                    <MediaWatermark size="sm" />
                  </div>
                  <div className="p-5 md:p-6 lg:p-7 flex-1 flex flex-col">
                    <div className="flex items-center text-[11px] md:text-xs text-slate-500 mb-2 md:mb-3 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> {article.date}
                    </div>
                    <h4 className="text-base md:text-lg font-bold font-heading text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <span className="mt-auto inline-flex items-center text-xs md:text-sm font-bold text-amber-700 group-hover:text-primary transition-colors">
                      Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Official Contact & Maps Section (Aligned with CMS Settings) */}
      <section className="py-16 md:py-24 relative bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-amber-100 overflow-hidden flex-col-reverse lg:flex-row">

            {/* Contact Details */}
            <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-gradient-to-br from-white to-amber-50/30 order-2 lg:order-1">
              <h2 className="text-[11px] md:text-xs font-bold text-amber-700 uppercase tracking-widest mb-2 md:mb-3">Kontak Resmi</h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4 md:mb-6 text-slate-900">
                Pusat Informasi & Layanan
              </h3>
              <p className="text-sm md:text-base text-slate-600 mb-8 leading-relaxed">
                Layanan gawat darurat, pendaftaran janji temu dokter, dan layanan informasi kami siap mendampingi Anda 24 jam sehari.
              </p>

              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Alamat Rumah Sakit</h4>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{settings.address || "Jl. Soekarno Hatta No. 123, Batusangkar, Tanah Datar, Sumatera Barat"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Telepon CS & IGD 24 Jam</h4>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">CS: {settings.phoneCs || "(0752) 71234"}</p>
                    <p className="text-xs md:text-sm text-red-600 font-semibold">Darurat: {settings.phoneEmergency || "0812-3456-7890"}</p>
                    <p className="text-xs md:text-sm text-emerald-700 font-medium">WhatsApp: {settings.whatsapp || "+62 811 2345 6789"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Email Resmi</h4>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">{settings.email || "info@rsiasayangibu.co.id"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Visual with Proportional Watermark */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[400px] lg:min-h-full bg-slate-100 order-1 lg:order-2 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                alt="Lokasi RSIA Sayang Ibu"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>

              {/* Proportional Watermark on Maps Image */}
              <MediaWatermark size="sm" />

              <div className="absolute inset-0 flex items-center justify-center p-4">
                <a
                  href={settings.mapsUrl || "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-amber-200/80 w-full max-w-[240px] text-center flex flex-col items-center group hover:scale-105 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold font-heading text-slate-900 text-sm md:text-base mb-1">RSIA Sayang Ibu</h5>
                  <p className="text-[11px] text-slate-500 mb-3">Batusangkar, Tanah Datar</p>
                  <span className="text-xs font-bold text-primary underline underline-offset-4 group-hover:text-amber-700">
                    Buka di Google Maps
                  </span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}


