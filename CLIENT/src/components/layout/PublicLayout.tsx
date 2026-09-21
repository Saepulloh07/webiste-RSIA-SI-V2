import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Instagram, Facebook, Phone, Clock, MapPin } from "lucide-react";
import { useStore } from "@/store";
import { HospitalLogo } from "@/components/common/HospitalLogo";
import { ScrollToTop } from "@/components/common/ScrollToTop";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.77 1.526V6.79a4.831 4.831 0 01-1.003-.104z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export function PublicLayout() {
  const { settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Auto Scroll to Top on every route/page navigation */}
      <ScrollToTop />

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}?text=Halo%20RSIA%20Sayang%20Ibu,%20saya%20ingin%20berkonsultasi`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-xl shadow-[#25D366]/40 hover:scale-110 transition-transform duration-300 border-[3px] border-white"
        aria-label="Hubungi kami via WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-white text-slate-800 text-xs font-bold py-2 px-3.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-amber-200">
          Konsultasi & Pendaftaran WhatsApp
        </span>
        <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8" />
      </a>

      {/* Luxurious Top Notification & Emergency Bar */}
      <div className="bg-gradient-to-r from-primary via-primary-hover to-tertiary text-white text-xs md:text-sm py-2 px-4 shadow-sm border-b border-amber-300/30">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 tracking-wide">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/30">
              IGD 24 Jam
            </span>
            <span className="text-white/90">
              Layanan Darurat Ibu & Anak:{" "}
              <a 
                href={`tel:${(settings.phoneEmergency || '').replace(/\D/g, '')}`} 
                className="font-bold underline decoration-amber-300 underline-offset-2 hover:text-amber-200 transition-colors"
              >
                {settings.phoneEmergency}
              </a>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs text-white/90">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-200" />
              {settings.operationalHours}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-200" />
              Batusangkar, Tanah Datar
            </span>
          </div>
        </div>
      </div>
      
      {/* Sleek Luxury Glass Navbar */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-md py-2.5" 
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Authentic Hospital Logo with Emblem and Title */}
          <HospitalLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { name: "Beranda", path: "/" },
              { name: "Layanan", path: "/layanan" },
              { name: "Dokter", path: "/dokter" },
              { name: "Informasi Pasien", path: "/informasi-pasien" },
              { name: "Artikel", path: "/artikel" },
              { name: "Karir", path: "/karir" },
            ].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-sm font-semibold transition-colors relative py-1 group ${
                    isActive ? "text-primary" : "text-slate-700 hover:text-primary"
                  }`}
                >
                  {link.name}
                  <span 
                    className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/admin" 
              className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Portal Staff
            </Link>
            <Link 
              to="/pendaftaran" 
              className="relative group overflow-hidden bg-gradient-to-r from-primary to-primary-hover text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-white/20"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Buat Janji</span>
                <span className="text-amber-200">✦</span>
              </span>
              <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-secondary to-secondary-hover transition-all duration-300 ease-out group-hover:w-full z-0"></div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-amber-100 overflow-hidden shadow-xl"
            >
              <nav className="flex flex-col p-4 gap-3">
                {[
                  { name: "Beranda", path: "/" },
                  { name: "Layanan Medis", path: "/layanan" },
                  { name: "Jadwal Dokter", path: "/dokter" },
                  { name: "Informasi Pasien", path: "/informasi-pasien" },
                  { name: "Artikel & Berita", path: "/artikel" },
                  { name: "Lowongan Kerja (Karir)", path: "/karir" },
                  { name: "Tentang Kami", path: "/tentang-kami" },
                  { name: "Kontak & Lokasi", path: "/kontak" },
                ].map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-800 py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  to="/pendaftaran" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="bg-primary text-white text-center px-4 py-3 rounded-xl text-sm font-bold mt-2 shadow-md"
                >
                  Buat Janji Konsultasi
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Luxurious & Graceful Footer */}
      <footer className="bg-[#0b1329] text-slate-300 pt-16 pb-12 border-t-[5px] border-gradient-to-r from-primary via-secondary to-tertiary relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
            {/* Hospital Identity Column */}
            <div className="md:col-span-1">
              <HospitalLogo 
                size="lg" 
                isLink={false} 
                textClassName="text-white" 
                subtextClassName="text-amber-300"
                className="mb-4"
              />
              <p className="text-sm leading-relaxed text-slate-400 mb-6">
                {settings.aboutText || "Rumah sakit ibu dan anak berstandar tinggi dengan pelayanan medis sepenuh hati."}
              </p>
              <div className="text-xs text-slate-400 space-y-1.5 border-l-2 border-secondary pl-3">
                <p className="font-semibold text-white">{settings.slogan}</p>
                <p className="text-slate-400">{settings.address}</p>
              </div>
            </div>
            
            {/* Quick Medical Links */}
            <div>
              <h4 className="text-white font-bold font-heading mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Layanan Cepat
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/pendaftaran" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Pendaftaran Online</Link></li>
                <li><Link to="/dokter" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Jadwal Dokter Spesialis</Link></li>
                <li><Link to="/layanan" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Poliklinik & Layanan Medis</Link></li>
                <li><Link to="/fasilitas" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Fasilitas Rawat Inap</Link></li>
                <li><Link to="/informasi-pasien" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Petunjuk Pasien & Jam Besuk</Link></li>
              </ul>
            </div>

            {/* Corporate & Company Info */}
            <div>
              <h4 className="text-white font-bold font-heading mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Informasi Perusahaan
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/tentang-kami" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Profil & Visi Misi RSIA</Link></li>
                <li><Link to="/artikel" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Artikel & Edukasi Kesehatan</Link></li>
                <li><Link to="/karir" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-200 font-semibold"><span>›</span> Lowongan Pekerjaan (Karir)</Link></li>
                <li><Link to="/kontak" className="hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>›</span> Kontak & Lokasi Batusangkar</Link></li>
                <li><Link to="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400"><span>›</span> Portal Staff & Admin</Link></li>
              </ul>
            </div>

            {/* Emergency & Social Media */}
            <div>
              <h4 className="text-white font-bold font-heading mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                Kontak & Darurat
              </h4>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 backdrop-blur-sm">
                <p className="text-xs text-amber-300 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> IGD 24 Jam Batusangkar
                </p>
                <p className="text-lg font-bold text-white font-heading">{settings.phoneEmergency}</p>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Layanan Informasi / CS</p>
                  <p className="text-sm font-semibold text-slate-200">{settings.phoneCs || settings.whatsapp}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">Ikuti Media Sosial Kami</p>
                <div className="flex items-center gap-3">
                  {settings.instagram && (
                    <a 
                      href={settings.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-tr hover:from-amber-500 hover:to-primary hover:text-white transition-all text-slate-300 hover:scale-110 shadow-sm" 
                      aria-label="Instagram RSIA Sayang Ibu"
                      title="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {settings.tiktok && (
                    <a 
                      href={settings.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-black hover:border-slate-700 hover:text-white transition-all text-slate-300 hover:scale-110 shadow-sm" 
                      aria-label="TikTok RSIA Sayang Ibu"
                      title="TikTok"
                    >
                      <TiktokIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings.facebook && (
                    <a 
                      href={settings.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-slate-300 hover:scale-110 shadow-sm" 
                      aria-label="Facebook RSIA Sayang Ibu"
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} {settings.hospitalName}. Pelayanan Medis Sepenuh Hati.</p>
            <div className="flex gap-6">
              <Link to="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link>
              <Link to="/karir" className="hover:text-white transition-colors">Karir</Link>
              <Link to="/kontak" className="hover:text-white transition-colors">Kontak</Link>
              <Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

