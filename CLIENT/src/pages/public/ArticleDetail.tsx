import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, ArrowRight, Sparkles, BookOpen, Share2 } from "lucide-react";
import { useStore } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/common/SEOHead";

import { Button } from "@/components/ui/button";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, settings } = useStore();

  const article = articles.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-800">Artikel Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8 text-sm">Maaf, artikel edukasi kesehatan yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6">
          <Link to="/artikel">Kembali ke Daftar Artikel</Link>
        </Button>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(a => a.status === "Published" && a.id !== article.id)
    .slice(0, 3);

  const articleImage = article.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop";

  // Plain text snippet for meta description
  const cleanSnippet = article.content.replace(/<[^>]*>?/gm, '').slice(0, 160).trim();

  // Dynamic Medical / Tech Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": article.title,
    "headline": article.title,
    "description": cleanSnippet,
    "image": articleImage,
    "datePublished": "2024-10-14T08:00:00+07:00",
    "dateModified": "2024-10-14T08:00:00+07:00",
    "author": {
      "@type": "MedicalOrganization",
      "name": `Tim Medis ${settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}`
    },
    "publisher": {
      "@type": "Hospital",
      "name": "RSIA Sayang Ibu Batusangkar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sayangibu.co.id/logo-sayang-ibu-sm.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sayangibu.co.id/artikel/${article.slug}`
    }
  };

  const articleKeywords = `${article.title.toLowerCase()}, ${article.category.toLowerCase()}, artikel kesehatan keluarga, rsia sayang ibu batusangkar, dokter kandungan batusangkar, spesialis anak tanah datar, kesehatan batusangkar sumatera barat`;

  return (
    <div className="bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen pb-24">

      {/* Dynamic SEO Meta & Schema for Article */}
      <SEOHead
        title={article.title}
        description={cleanSnippet}
        keywords={articleKeywords}
        ogType="article"
        ogImage={articleImage}
        canonicalUrl={`https://sayangibu.co.id/artikel/${article.slug}`}
        schemaData={articleSchema}
      />

      {/* Header Banner */}
      <div className="w-full h-[36vh] md:h-[48vh] relative bg-slate-900 overflow-hidden">
        <img
          src={articleImage}
          alt={article.title}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

        {/* Circular Watermark on Article Header Banner */}
        <MediaWatermark size="lg" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-8 md:pb-12 max-w-5xl">
            <Link
              to="/artikel"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 md:mb-6 text-xs md:text-sm font-semibold bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-amber-200 mb-3 md:mb-4">
              <Badge className="bg-primary text-white font-bold px-3 py-1 border-0 shadow-md">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1.5 text-white/90 font-medium">
                <Calendar className="w-4 h-4 text-amber-300" /> {article.date}
              </span>
              <span className="flex items-center gap-1.5 text-white/90 font-medium">
                <Sparkles className="w-4 h-4 text-amber-300" /> {article.author || `Tim Redaksi Medis ${settings.hospitalName || "RSIA Sayang Ibu"}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white max-w-4xl leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8 md:mt-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-100 shadow-sm">
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-10 pt-6 border-t border-amber-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-amber-700 mr-1" />
                {article.tags && article.tags.length > 0 ? (
                  article.tags.map((t, idx) => (
                    <span key={idx} className="bg-rose-50 text-primary border border-rose-100 px-3 py-1 rounded-full text-xs font-semibold">
                      {t}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-rose-50 text-primary border border-rose-100 px-3 py-1 rounded-full text-xs font-semibold">Edukasi Medis</span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full text-xs font-semibold">Kesehatan Keluarga</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">{article.category}</span>
                  </>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-amber-900">Catatan Medis:</span> Artikel ini disusun sebagai sarana edukasi dan informasi umum. Untuk penanganan klinis, diagnosis, dan terapi spesifik, konsultasikan langsung dengan dokter spesialis di {settings.hospitalName || "RSIA Sayang Ibu"}.
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
              <h3 className="font-bold font-heading mb-4 text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Artikel Terkait
              </h3>

              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/artikel/${rel.slug || rel.id}`}
                    className="group block pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center text-[11px] text-amber-700 mb-1 font-semibold">
                      <span>{rel.category}</span>
                      <span className="mx-1.5">•</span>
                      <span>{rel.date}</span>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            {/* Doctor Booking Box */}
            <div className="bg-gradient-to-br from-rose-50 via-amber-50/50 to-emerald-50/30 rounded-3xl p-6 border border-amber-200/80 shadow-sm text-center">
              <h4 className="font-bold font-heading text-slate-900 text-base mb-2">Konsultasi dengan Ahlinya</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Jadwalkan pemeriksaan kesehatan keluarga secara cepat dan mudah melalui reservasi online.
              </p>
              <Link
                to="/pendaftaran"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                Daftar Janji Temu <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
