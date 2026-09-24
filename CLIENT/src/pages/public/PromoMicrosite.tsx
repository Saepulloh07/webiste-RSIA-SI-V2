import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, CheckCircle2, Clock, ShieldCheck, ChevronRight, Star, HelpCircle, PhoneCall, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useStore, AdCampaign } from "@/store";
import { SEOHead } from "@/components/common/SEOHead";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { HospitalLogo } from "@/components/common/HospitalLogo";
import { Button } from "@/components/ui/button";
import { api } from "@/app/api";

export default function PromoMicrosite() {
  const { slug } = useParams<{ slug: string }>();
  const { ads, settings } = useStore();
  const [fetchedCampaign, setFetchedCampaign] = useState<AdCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const campaign = ads.find(a => a.slug === slug || a.id === slug) || fetchedCampaign;

  useEffect(() => {
    if (!ads.find(a => a.slug === slug || a.id === slug) && slug) {
      setIsLoading(true);
      api.ads.getOne(slug)
        .then((res) => {
          if (res?.data) setFetchedCampaign(res.data);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [ads, slug]);

  if (isLoading && !campaign) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Memuat promo layanan...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-800">Promo Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8 text-sm">Maaf, promo layanan kesehatan yang Anda cari telah berakhir atau belum aktif.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  // Dynamic countdown timer for high-conversion marketing effect
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const waNumber = (campaign.contactWa || settings.whatsapp || "+6281123456789").replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Halo RSIA Sayang Ibu Batusangkar, saya tertarik dengan "${campaign.title}". Mohon info jadwal dokter dan cara klaim promonya. Terima kasih!`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  // Structured Data for Google Ads & Organic SEO Rich Snippets
  const promoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": campaign.title,
        "image": campaign.image || "https://sayangibu.co.id/logo-sayang-ibu-sm.png",
        "description": campaign.content,
        "brand": {
          "@type": "Brand",
          "name": "RSIA Sayang Ibu Batusangkar"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://sayangibu.co.id/promo/${campaign.slug}`,
          "priceCurrency": "IDR",
          "price": campaign.price?.replace(/\D/g, "") || "6800000",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Hospital",
            "name": "RSIA Sayang Ibu Batusangkar"
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Bagaimana cara klaim promo ini di RSIA Sayang Ibu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anda cukup klik tombol reservasi via WhatsApp resmi kami, tim customer care akan mendaftarkan slot dan menjadwalkan konsultasi dokter spesialis sesuai waktu Anda."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah biaya sudah mencakup kamar rawat inap dan obat-obatan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, paket promo ini sudah dirancang transparan mencakup fasilitas rawat inap, visitasi dokter spesialis, obat-obatan dasar, serta pelayanan medis lengkap tanpa biaya tersembunyi."
            }
          },
          {
            "@type": "Question",
            "name": "Di mana lokasi RSIA Sayang Ibu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "RSIA Sayang Ibu berlokasi di Jl. Soekarno Hatta No.123, Batusangkar, Kabupaten Tanah Datar, Sumatera Barat."
            }
          }
        ]
      }
    ]
  };

  const dynamicKeywords = campaign.targetKeywords 
    ? `${campaign.targetKeywords}, rsia sayang ibu batusangkar, dokter kandungan batusangkar, tanah datar sumatera barat`
    : `promo ${campaign.title.toLowerCase()}, rsia sayang ibu batusangkar, dokter kandungan batusangkar, rumah sakit bersalin tanah datar`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative pb-24 md:pb-0 selection:bg-primary/20">
      
      {/* Targeted SEO for Microweb / Promo Ads */}
      <SEOHead 
        title={`${campaign.title} | Promo Spesial RSIA Sayang Ibu Batusangkar`}
        description={`${campaign.content.slice(0, 150)}... Klaim promo sekarang di RSIA Sayang Ibu Batusangkar Tanah Datar.`}
        keywords={dynamicKeywords}
        ogType="article"
        ogImage={campaign.image || "https://sayangibu.co.id/logo-sayang-ibu-sm.png"}
        schemaData={promoSchema}
      />

      {/* Landing Page Navbar with Circular Hospital Logo */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100 shadow-sm py-2">
        <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-xs sm:text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> <span>Kembali ke Beranda</span>
          </Link>
          
          <HospitalLogo size="sm" showText={true} />
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50/60 pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-amber-100">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
              
              {/* Promo Pitch */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-xs font-bold uppercase tracking-wider mb-5 border border-rose-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  {campaign.badge || "Penawaran Spesial Terbatas"}
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading leading-tight mb-5 text-slate-900">
                  {campaign.title}
                </h1>
                
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {campaign.content}
                </p>

                {/* Price Display */}
                {campaign.price && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 inline-block w-full max-w-md">
                    <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider block mb-1">
                      Biaya Paket Promo Spesial
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-bold font-heading text-primary">
                        {campaign.price}
                      </span>
                      {campaign.originalPrice && (
                        <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                          {campaign.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      *Syarat & ketentuan berlaku. Kuota pendaftaran terbatas.
                    </span>
                  </div>
                )}

                {/* Urgency Countdown */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200/80 mb-8 inline-block w-full max-w-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Promo Berakhir Dalam:
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-2xl font-bold font-heading text-slate-800">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Jam</div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-2xl font-bold font-heading text-slate-800">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Menit</div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-2xl font-bold font-heading text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-[10px] text-primary/70 font-semibold uppercase">Detik</div>
                    </div>
                  </div>
                </div>

                {/* Desktop CTA Button */}
                <div className="hidden md:flex flex-col sm:flex-row gap-3">
                  <a 
                    href={waUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white rounded-full font-bold text-base hover:bg-[#20b958] hover:shadow-lg hover:scale-105 transition-all shadow-md shadow-[#25D366]/30"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Klaim Promo via WhatsApp
                  </a>
                  <a 
                    href={`tel:${(settings.phoneCs || '0752123456').replace(/\D/g, '')}`}
                    className="inline-flex items-center justify-center px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 mr-2 text-primary" /> Hubungi CS
                  </a>
                </div>
              </div>

              {/* Visual Banner with Circular Watermark */}
              <div className="relative">
                <div className="aspect-[4/5] sm:aspect-square w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white relative z-10">
                  <img 
                    src={campaign.image || "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80"} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width="600"
                    height="600"
                  />
                  
                  {/* Circular Watermark */}
                  <MediaWatermark size="lg" />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center gap-1 mb-1.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-xs sm:text-sm font-medium italic">"Pelayanannya sangat ramah, fasilitas bersih berstandar tinggi, dan dokternya sangat menenangkan."</p>
                      <p className="text-xs text-amber-200 font-semibold mt-1">— Pasien RSIA Sayang Ibu Batusangkar</p>
                    </div>
                  </div>
                </div>
                
                {/* Trust Accreditation Badge */}
                <div className="absolute -bottom-5 -left-4 bg-white p-3.5 rounded-2xl shadow-lg border border-amber-200/80 z-20 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center aspect-square shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Akreditasi Rumah Sakit</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Kemenkes RI Paripurna</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
                Keunggulan Layanan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-3">
                Keuntungan Eksklusif Paket Promo
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Setiap tindakan medis di RSIA Sayang Ibu Batusangkar memprioritaskan keselamatan, kenyamanan, dan privasi ibu serta buah hati.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5 mb-12">
              {(campaign.highlights || [
                "Ditangani langsung oleh Dokter Spesialis kandungan & anak berpengalaman.",
                "Fasilitas ruang perawatan VVIP/VIP modern, bersih, dan ber-AC.",
                "Peralatan medis diagnostik canggih (USG 4D HD Live).",
                "Harga promo transparan sudah termasuk biaya administrasi & obat dasar.",
                "Pendampingan intensif oleh bidan dan perawat bersertifikasi 24 Jam.",
                "Konsultasi gizi & laktasi gratis pasca melahirkan."
              ]).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0 mt-0.5 aspect-square">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            {/* Campaign FAQs (High Quality Score for Google Ads & SEO) */}
            <div className="border-t border-slate-100 pt-10">
              <h3 className="text-lg md:text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Pertanyaan Sering Diajukan (FAQ)
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <p className="font-bold text-slate-800 text-sm mb-1">Bagaimana cara mengklaim promo ini?</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Klik tombol "Klaim Promo via WhatsApp" untuk terhubung langsung dengan customer care RSIA Sayang Ibu Batusangkar. Tim kami akan mendaftarkan nama Anda dan mengatur jadwal kunjungan sesuai preferensi.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <p className="font-bold text-slate-800 text-sm mb-1">Apakah bisa dicover asuransi atau perusahaan?</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    RSIA Sayang Ibu bekerja sama dengan berbagai asuransi kesehatan swasta terkemuka. Silakan informasikan jenis asuransi Anda saat konfirmasi via WhatsApp.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <p className="font-bold text-slate-800 text-sm mb-1">Kapan promo ini berakhir?</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Promo ini berlaku hingga kuota pendaftaran bulanan terpenuhi. Kami menyarankan untuk melakukan reservasi lebih awal guna memastikan ketersediaan kamar dan jadwal dokter.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Floating Sticky CTA for Mobile Ads Visitors */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-3 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-50">
        <a 
          href={waUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-center w-full px-5 py-3.5 bg-[#25D366] text-white rounded-full font-bold text-sm shadow-md active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5 mr-2" /> Klaim Promo via WhatsApp <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>

    </div>
  );
}


