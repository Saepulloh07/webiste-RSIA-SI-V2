import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ChevronRight, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { SEOHead } from "@/components/common/SEOHead";

export default function Articles() {
  const { articles, settings } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  // Only published articles for public view
  const publishedArticles = articles.filter(a => a.status === "Published");

  const categories = ["Semua Kategori", ...Array.from(new Set(publishedArticles.map(a => a.category)))];

  const filteredArticles = publishedArticles.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Semua Kategori" || article.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      <SEOHead
        title="Artikel & Berita Kesehatan keluarga | RSIA Sayang Ibu Batusangkar"
        description="Panduan edukasi kehamilan, nutrisi janin, metode persalinan ERACS, imunisasi anak, dan tips medis terpercaya dari dokter spesialis RSIA Sayang Ibu Batusangkar."
        keywords="artikel kesehatan anak batusangkar, tips kehamilan tanah datar, edukasi melahirkan eracs, dokter spesialis kandungan batusangkar, rsia sayang ibu berita"
        ogType="website"
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Edukasi & Informasi Medis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Artikel & Berita Kesehatan
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Edukasi kehamilan, panduan tumbuh kembang buah hati, dan wawasan medis terpercaya dari {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Articles List */}
          <div className="lg:w-2/3 space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm">
                <BookOpen className="w-12 h-12 text-amber-500/60 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg mb-1">Belum Ada Artikel Ditemukan</h3>
                <p className="text-slate-500 text-sm mb-4">Coba sesuaikan kata kunci pencarian atau pilih kategori lain.</p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("Semua Kategori"); }}
                  className="text-xs font-bold text-primary underline"
                >
                  Tampilkan Semua Artikel
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all duration-300 border border-amber-100/80 group"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5 aspect-video md:aspect-auto bg-slate-100 relative overflow-hidden shrink-0">
                      <img
                        src={article.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* Proportional Watermark */}
                      <MediaWatermark size="sm" />

                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/95 text-primary backdrop-blur-sm border border-amber-200/50 shadow-sm text-xs font-semibold px-2.5 py-0.5">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-xs text-slate-500 mb-2 font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> {article.date}
                        </div>
                        <h2 className="text-lg md:text-xl font-bold font-heading mb-3 text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link to={`/artikel/${article.slug || article.id}`}>{article.title}</Link>
                        </h2>
                        <div
                          className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: article.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
                          }}
                        />
                      </div>
                      <div>
                        <Link
                          to={`/artikel/${article.slug || article.id}`}
                          className="inline-flex items-center text-xs md:text-sm font-bold text-amber-700 group-hover:text-primary transition-colors"
                        >
                          Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
              <h3 className="font-bold font-heading mb-4 text-base text-slate-900">Pencarian Artikel</h3>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                <Input
                  placeholder="Cari topik kesehatan..."
                  className="pl-10 h-11 rounded-xl border-amber-200 text-sm focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
              <h3 className="font-bold font-heading mb-4 text-base text-slate-900">Kategori Topik</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat
                        ? "bg-gradient-to-r from-primary to-amber-600 text-white shadow-sm"
                        : "bg-amber-50/70 text-slate-700 hover:bg-amber-100"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Contact Info Box */}
            <div className="bg-gradient-to-br from-rose-50 via-amber-50/50 to-emerald-50/30 rounded-3xl p-6 border border-amber-200/80 shadow-sm">
              <h4 className="font-bold font-heading text-slate-900 text-sm mb-2">Konsultasi Kesehatan Keluarga</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Punya pertanyaan seputar kehamilan atau keluhan anak? Dokter spesialis kami siap memberikan diagnosis dan penanganan terbaik.
              </p>
              <Link
                to="/pendaftaran"
                className="block text-center w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Jadwalkan Konsultasi Dokter
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
