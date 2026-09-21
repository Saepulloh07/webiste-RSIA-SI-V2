import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Link as LinkIcon, ExternalLink, Megaphone, Tag, Percent, Calendar, MessageSquare, Sparkles, Globe, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, AdCampaign } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ManageAds() {
  const { ads, setAds } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdCampaign | null>(null);

  const [formData, setFormData] = useState<Partial<AdCampaign>>({});
  const [highlightsText, setHighlightsText] = useState("");
  const [search, setSearch] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const role = localStorage.getItem("adminRole") || "Editor";
  const isEditor = role === "Editor";

  const handleOpenModal = (ad?: AdCampaign) => {
    if (ad) {
      setEditingAd(ad);
      setFormData(ad);
      setHighlightsText(ad.highlights ? ad.highlights.join("\n") : "");
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        slug: "",
        badge: "Diskon Terbatas",
        price: "",
        originalPrice: "",
        startDate: "",
        endDate: "",
        status: isEditor ? "Draft" : "Aktif",
        content: "",
        targetKeywords: "",
        contactWa: ""
      });
      setHighlightsText("");
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const parsedHighlights = highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const updatedData: Partial<AdCampaign> = {
      ...formData,
      highlights: parsedHighlights
    };

    if (editingAd) {
      setAds(ads.map((a) => (a.id === editingAd.id ? { ...a, ...updatedData } as AdCampaign : a)));
    } else {
      setAds([...ads, { ...updatedData, id: Date.now().toString() } as AdCampaign]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus iklan/promo ini?")) {
      setAds(ads.filter((a) => a.id !== id));
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/promo/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredAds = ads.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Iklan & Promo</h2>
          <p className="text-xs sm:text-sm text-slate-500">Buat microsite promosi dan landing page paket persalinan/kesehatan.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Tambah Promo
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari kampanye promo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{filteredAds.length}</strong> kampanye
          </div>
        </div>
        
        {/* Mobile View: Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {ads.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada promo kampanye. Klik "Tambah Kampanye" untuk membuat microsite promo baru.
            </div>
          )}
          {filteredAds.map((ad) => (
            <div key={ad.id} className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-primary">{ad.badge || "Promo"}</span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{ad.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ad.startDate} - {ad.endDate}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                  ad.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' :
                  ad.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {ad.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopyLink(ad.slug)} 
                    className="h-7 px-2 text-xs rounded-lg border-slate-200"
                  >
                    <LinkIcon className="w-3 h-3 mr-1 text-slate-400" /> 
                    <span>{copiedSlug === ad.slug ? "Tersalin!" : "Salin URL"}</span>
                  </Button>
                  <a 
                    href={`/promo/${ad.slug}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 text-slate-500 hover:text-primary transition-colors" 
                    title="Buka Microsite"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => handleOpenModal(ad)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={() => handleDelete(ad.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Judul Kampanye</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">URL Microsite</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {ads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 text-xs">
                    Belum ada promo kampanye. Klik "Tambah Kampanye" untuk membuat microsite promo baru.
                  </td>
                </tr>
              )}
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{ad.title}</p>
                    <span className="text-xs text-slate-400">Slug: /{ad.slug}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    {ad.startDate} - {ad.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' :
                      ad.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopyLink(ad.slug)} className="h-8 px-2.5 text-xs rounded-lg">
                        <LinkIcon className="w-3 h-3 mr-1 text-slate-400" /> 
                        <span>{copiedSlug === ad.slug ? "Tersalin!" : "Salin URL"}</span>
                      </Button>
                      <a href={`/promo/${ad.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:text-secondary transition-colors p-1" title="Buka Microsite">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenModal(ad)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ad.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAd ? "Edit Kampanye Promo" : "Tambah Kampanye Promo Baru"}
        description="Kelola halaman promosi khusus, microsite paket persalinan, diskon layanan, dan integrasi WhatsApp."
        icon={<Megaphone className="w-5 h-5 text-primary" />}
        size="4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Promo
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Section 1: Visual Banner & Identitas Kampanye */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Megaphone className="w-4 h-4 text-primary" />
              <span>Identitas & Visual Microsite</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Banner Utama Promo</Label>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <ImageUpload 
                    value={formData.image || ""} 
                    onChange={(val) => setFormData({ ...formData, image: val })} 
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">Rasio 16:9 foto resolusi tinggi</p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Judul Kampanye Promo <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title || ""} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") })} 
                    placeholder="Contoh: Promo Persalinan Caesar ERACS 2024 - Cepat Pulih & Nyaman"
                    className="h-10 bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slug" className="text-xs font-semibold text-slate-700">Slug / Tautan Landing Page</Label>
                  <div className="relative">
                    <Input 
                      id="slug" 
                      value={formData.slug || ""} 
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                      placeholder="promo-persalinan-eracs-2024"
                      className="h-10 bg-white font-mono text-xs pr-28"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">/promo/...</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="badge" className="text-xs font-semibold text-slate-700">Label / Badge Promo</Label>
                    <div className="relative">
                      <Input 
                        id="badge" 
                        value={formData.badge || ""} 
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })} 
                        placeholder="Contoh: Diskon 20% Terbatas"
                        className="h-10 bg-white pr-8"
                      />
                      <Tag className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Kampanye</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:bg-slate-100"
                      value={formData.status || "Draft"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as AdCampaign["status"] })}
                      disabled={isEditor}
                    >
                      <option value="Draft">Draft (Disimpan Sementara)</option>
                      <option value="Aktif">Aktif (Ditayangkan Publik)</option>
                      <option value="Berakhir">Berakhir / Ditutup</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Skema Tarif & Periode */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Skema Harga & Periode Promo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-slate-700">Harga Promo</Label>
                <Input 
                  id="price" 
                  value={formData.price || ""} 
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  placeholder="Contoh: Rp 6.800.000"
                  className="h-10 bg-white font-semibold text-emerald-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="originalPrice" className="text-xs font-semibold text-slate-700">Harga Coret / Normal</Label>
                <Input 
                  id="originalPrice" 
                  value={formData.originalPrice || ""} 
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} 
                  placeholder="Contoh: Rp 8.500.000"
                  className="h-10 bg-white line-through text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-xs font-semibold text-slate-700">Tanggal Mulai</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate || ""} 
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                  className="h-10 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-xs font-semibold text-slate-700">Tanggal Berakhir</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={formData.endDate || ""} 
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
                  className="h-10 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deskripsi & Poin Keunggulan */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Deskripsi Penawaran & Fasilitas Paket</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold text-slate-700">Deskripsi Penawaran Promo</Label>
                <textarea 
                  id="content" 
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={formData.content || ""} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  placeholder="Jelaskan secara persuasif kelebihan promo persalinan atau pemeriksaan ini..."
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="highlights" className="text-xs font-semibold text-slate-700">Poin Keunggulan / Fasilitas Paket</Label>
                  <span className="text-[11px] text-slate-400">1 baris per poin</span>
                </div>
                <textarea 
                  id="highlights" 
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={highlightsText} 
                  onChange={(e) => setHighlightsText(e.target.value)} 
                  placeholder="Contoh:&#10;Metode ERACS: Bisa duduk 2 jam pasca tindakan&#10;Kamar Rawat Inap VIP eksklusif dan nyaman&#10;Didampingi Dokter Spesialis Obgyn & Dokter Anak&#10;Free souvenir bayi & dokumentasi momen persalinan"
                />
                <p className="text-[11px] text-slate-500">Poin-poin ini tampil sebagai fitur unggulan pada landing page microsite promo.</p>
              </div>
            </div>
          </div>

          {/* Section 4: SEO & Kontak WhatsApp */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Optimasi Iklan & WhatsApp Konversi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="targetKeywords" className="text-xs font-semibold text-slate-700">Target Kata Kunci SEO / Google Ads</Label>
                <Input 
                  id="targetKeywords" 
                  value={formData.targetKeywords || ""} 
                  onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })} 
                  placeholder="Contoh: promo persalinan eracs batusangkar, operasi sesar murah..."
                  className="h-10 bg-white"
                />
                <p className="text-[11px] text-slate-400">Dimasukkan ke dalam meta keywords halaman promo</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactWa" className="text-xs font-semibold text-slate-700">Nomor WhatsApp Khusus Promo (Opsional)</Label>
                <div className="relative">
                  <Input 
                    id="contactWa" 
                    value={formData.contactWa || ""} 
                    onChange={(e) => setFormData({ ...formData, contactWa: e.target.value })} 
                    placeholder="Contoh: +6281123456789"
                    className="h-10 bg-white pr-9"
                  />
                  <PhoneCall className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400">Kosongkan jika menggunakan WhatsApp rumah sakit utama</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
