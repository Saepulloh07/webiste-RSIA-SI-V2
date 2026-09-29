import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Check,
  ChevronRight,
  Link2,
  List,
  MessageCircle,
  Facebook,
  Twitter,
  Share2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useStore, Article } from "@/store";
import { MediaWatermark } from "@/components/common/MediaWatermark";
import { SEOHead } from "@/components/common/SEOHead";
import { Button } from "@/components/ui/button";
import { api } from "@/app/api";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop";

type TocItem = { id: string; text: string; level: 2 | 3 };

const slugifyHeading = (text: string, index: number) => {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${base || "bagian"}-${index}`;
};

/**
 * Menyiapkan HTML artikel:
 *  - membersihkan elemen/atribut berbahaya (script, style, onXXX, javascript:)
 *  - memberi id pada h2/h3 sehingga bisa dipakai sebagai daftar isi
 *  - membuka tautan eksternal di tab baru
 */
function processContent(rawHtml: string): { html: string; toc: TocItem[] } {
  if (!rawHtml || typeof DOMParser === "undefined") {
    return { html: rawHtml || "", toc: [] };
  }

  const doc = new DOMParser().parseFromString(rawHtml, "text/html");

  doc.querySelectorAll("script, style, iframe, object, embed").forEach((el) => el.remove());
  doc.body.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith("on") || ((name === "href" || name === "src") && val.startsWith("javascript:"))) {
        el.removeAttribute(attr.name);
      }
    });
  });

  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  const toc: TocItem[] = [];
  doc.querySelectorAll("h2, h3").forEach((h, i) => {
    const text = (h.textContent || "").trim();
    if (!text) return;
    const id = slugifyHeading(text, i);
    h.setAttribute("id", id);
    toc.push({ id, text, level: h.tagName === "H2" ? 2 : 3 });
  });

  return { html: doc.body.innerHTML, toc };
}

const MONTHS: Record<string, number> = {
  jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, maret: 2, apr: 3, april: 3,
  mei: 4, jun: 5, juni: 5, jul: 6, juli: 6, agu: 7, ags: 7, agustus: 7,
  sep: 8, sept: 8, september: 8, okt: 9, oktober: 9, nov: 10, november: 10,
  des: 11, desember: 11,
};

/** Mengubah tanggal tampilan ("14 Okt 2024") menjadi ISO 8601; undefined bila gagal. */
function toIsoDate(display?: string): string | undefined {
  if (!display) return undefined;
  const m = display.trim().toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})$/);
  if (m && MONTHS[m[2]] !== undefined) {
    const d = new Date(Date.UTC(Number(m[3]), MONTHS[m[2]], Number(m[1]), 1, 0, 0));
    return d.toISOString();
  }
  const parsed = Date.parse(display);
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
}

const getInitials = (name: string) =>
  name
    .replace(/^(dr\.?|drg\.?|dra\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "RS";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, settings } = useStore();
  const [fetchedArticle, setFetchedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  const article = articles.find((a) => a.slug === slug || a.id === slug) || fetchedArticle;
  const hospitalName = settings.hospitalName || "RSIA Sayang Ibu Batusangkar";

  useEffect(() => {
    if (!articles.find((a) => a.slug === slug || a.id === slug) && slug) {
      setIsLoading(true);
      api.articles
        .getOne(slug)
        .then((res) => {
          if (res?.data) setFetchedArticle(res.data);
        })
        .catch(() => { })
        .finally(() => setIsLoading(false));
    }
  }, [articles, slug]);

  // Halaman baru → mulai dari atas
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const { html, toc } = useMemo(() => processContent(article?.content ?? ""), [article?.content]);

  const readingMinutes = useMemo(() => {
    const words = (article?.content ?? "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [article?.content]);

  // Progress bar membaca
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const scrolled = -rect.top + window.innerHeight * 0.2;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [html]);

  // Highlight bagian aktif pada daftar isi
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc, html]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia */
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({ title: article.title, url: shareUrl });
        return;
      } catch {
        /* dibatalkan pengguna */
      }
    }
    handleCopy();
  }, [article, shareUrl, handleCopy]);

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------------- States: loading / not found ---------------- */

  if (isLoading && !article) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Memuat artikel edukasi medis...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-800">Artikel Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8 text-sm">
          Maaf, artikel edukasi kesehatan yang Anda cari tidak tersedia atau belum dipublikasikan.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6">
          <Link to="/artikel">Kembali ke Daftar Artikel</Link>
        </Button>
      </div>
    );
  }

  /* ---------------- Derived data ---------------- */

  const articleImage = article.image || FALLBACK_IMAGE;
  const authorName = article.author || `Tim Redaksi Medis ${settings.hospitalName || "RSIA Sayang Ibu"}`;
  const isoDate = toIsoDate(article.date);
  const canonical = `https://sayangibu.co.id/artikel/${article.slug || article.id}`;
  const cleanSnippet = article.content.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").slice(0, 160).trim();

  const published = articles.filter((a) => a.status === "Published" && a.id !== article.id);
  const relatedArticles = [
    ...published.filter((a) => a.category === article.category),
    ...published.filter((a) => a.category !== article.category),
  ].slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    headline: article.title,
    description: cleanSnippet,
    image: articleImage,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { "@type": "MedicalOrganization", name: `Tim Medis ${hospitalName}` },
    publisher: {
      "@type": "Hospital",
      name: "RSIA Sayang Ibu Batusangkar",
      logo: { "@type": "ImageObject", url: "https://sayangibu.co.id/logo-sayang-ibu-sm.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  const articleKeywords = `${article.title.toLowerCase()}, ${article.category.toLowerCase()}, artikel kesehatan keluarga, rsia sayang ibu batusangkar, dokter kandungan batusangkar, spesialis anak tanah datar, kesehatan batusangkar sumatera barat`;

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${article.title} - ${shareUrl}`)}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "X (Twitter)",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
    },
  ];

  const renderShareButtons = () => (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${label}`}
          title={`Bagikan ke ${label}`}
          className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-rose-50 flex items-center justify-center transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Salin tautan"
        title="Salin tautan"
        className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-rose-50 flex items-center justify-center transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );

  /* ---------------- Render ---------------- */

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEOHead
        title={article.title}
        description={cleanSnippet}
        keywords={articleKeywords}
        ogType="article"
        ogImage={articleImage}
        canonicalUrl={canonical}
        schemaData={articleSchema}
      />

      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent pointer-events-none" aria-hidden="true">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ============ Article Header ============ */}
      <header className="bg-gradient-to-b from-rose-50/60 to-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl pt-8 md:pt-12 pb-8 md:pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to="/artikel" className="hover:text-primary transition-colors">Artikel</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-medium truncate max-w-[14rem] sm:max-w-md">{article.category}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-4">
              {article.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-heading text-slate-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Byline */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  {getInitials(authorName)}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{authorName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Penulis / Reviewer Medis</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <time dateTime={isoDate}>{article.date}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {readingMinutes} menit baca
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Bagikan:</span>
              {renderShareButtons()}
            </div>
          </div>
        </div>
      </header>

      {/* ============ Body ============ */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl mt-8 md:mt-10">
        {/* Featured image */}
        <figure className="mb-10 md:mb-14">
          <div className="w-full aspect-[16/8] md:aspect-[16/7] rounded-2xl overflow-hidden relative bg-slate-100 shadow-md ring-1 ring-slate-200/60">
            <img
              src={articleImage}
              alt={article.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
            <MediaWatermark size="md" />
          </div>
        </figure>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
          {/* ---------- Main column ---------- */}
          <article ref={articleRef} className="min-w-0 max-w-3xl">
            {/* Mobile table of contents */}
            {toc.length >= 2 && (
              <details className="lg:hidden mb-8 rounded-xl border border-slate-200 bg-slate-50/70 group">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <List className="w-4 h-4 text-primary" /> Daftar Isi
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>
                <ol className="px-4 pb-4 space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === 3 ? "pl-4" : ""}>
                      <button
                        type="button"
                        onClick={() => scrollToHeading(t.id)}
                        className="text-left text-slate-600 hover:text-primary transition-colors"
                      >
                        {t.text}
                      </button>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />

            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400 mr-1" />
              {article.tags && article.tags.length > 0 ? (
                article.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">Edukasi Medis</span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">Kesehatan Keluarga</span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">{article.category}</span>
                </>
              )}
            </div>

            {/* Share footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Bermanfaat? Bagikan ke keluarga & kerabat.</p>
                <p className="text-xs text-slate-500 mt-0.5">Informasi kesehatan yang tepat dapat membantu lebih banyak keluarga.</p>
              </div>
              <div className="flex items-center gap-3">
                {renderShareButtons()}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                  <Share2 className="w-4 h-4" /> Lainnya
                </button>
              </div>
            </div>

            {/* Author box */}
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shrink-0">
                {getInitials(authorName)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Ditulis oleh</p>
                <p className="text-base font-bold text-slate-900 font-heading">{authorName}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Konten edukasi kesehatan ibu dan anak yang disusun serta ditinjau oleh tenaga medis {hospitalName}.
                </p>
              </div>
            </div>

            {/* Medical disclaimer */}
            <div className="mt-6 flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                <span className="font-bold text-amber-900">Catatan Medis: </span>
                Artikel ini disusun sebagai sarana edukasi dan informasi umum dan tidak menggantikan pemeriksaan
                maupun saran dokter. Untuk diagnosis dan terapi yang spesifik, konsultasikan langsung dengan dokter
                spesialis di {hospitalName}.
              </p>
            </div>
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="lg:sticky lg:top-24 self-start space-y-6">
            {toc.length >= 2 && (
              <nav aria-label="Daftar isi" className="hidden lg:block rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 font-sans">
                  <List className="w-4 h-4 text-primary" /> Daftar Isi
                </h3>
                <ol className="space-y-1 border-l border-slate-200 max-h-[45vh] overflow-y-auto">
                  {toc.map((t) => {
                    const active = activeHeading === t.id;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => scrollToHeading(t.id)}
                          className={`block w-full text-left text-[13px] leading-snug py-1.5 -ml-px border-l-2 transition-colors ${t.level === 3 ? "pl-7" : "pl-4"
                            } ${active
                              ? "border-primary text-primary font-semibold"
                              : "border-transparent text-slate-600 hover:text-primary hover:border-primary/40"
                            }`}
                        >
                          {t.text}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-primary to-rose-700 p-6 text-white shadow-lg shadow-primary/20">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-bold font-heading text-lg leading-snug mb-2">Konsultasi dengan Ahlinya</h4>
              <p className="text-xs text-white/85 leading-relaxed mb-5">
                Jadwalkan pemeriksaan kesehatan keluarga Anda dengan dokter spesialis melalui reservasi online.
              </p>
              <Link
                to="/pendaftaran"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl text-xs font-bold bg-white text-primary hover:bg-rose-50 transition-colors"
              >
                Daftar Janji Temu <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* ============ Related articles ============ */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 md:mt-20 pt-10 border-t border-slate-200" aria-labelledby="related-heading">
            <div className="flex items-end justify-between mb-6">
              <h2 id="related-heading" className="text-2xl md:text-3xl font-bold font-heading text-slate-900">
                Artikel Terkait
              </h2>
              <Link to="/artikel" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Lihat semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/artikel/${rel.slug || rel.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={rel.image || FALLBACK_IMAGE}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-[11px] text-slate-500 mb-2">
                      <span className="text-primary font-bold uppercase tracking-wider">{rel.category}</span>
                      <span className="mx-2">•</span>
                      <span>{rel.date}</span>
                    </div>
                    <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke daftar artikel
          </Link>
        </div>
      </div>
    </div>
  );
}