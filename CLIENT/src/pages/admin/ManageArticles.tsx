import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Eye, Newspaper, FileText, Tag, Calendar, UserCheck, Sparkles, Loader2 } from "lucide-react";
import { useStore, Article } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { api, normalizeRole } from "@/app/api";

export default function ManageArticles() {
  const [search, setSearch] = useState("");
  const { articles, setArticles, fetchArticles } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<Partial<Article>>({});
  const [tagsText, setTagsText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const role = normalizeRole(localStorage.getItem("adminRole"));
  const isEditor = role === "Editor";

  useEffect(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData(article);
      setTagsText(article.tags ? article.tags.join(", ") : "");
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        category: "Kebidanan & Kandungan",
        status: isEditor ? "Draft" : "Published",
        author: "Tim Redaksi Medis RSIA Sayang Ibu",
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        content: ""
      });
      setTagsText("Edukasi Medis, Kesehatan Keluarga");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const parsedTags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title?.trim() || "",
      category: formData.category || "Kebidanan & Kandungan",
      status: (formData.status as "Published" | "Draft") || "Published",
      author: formData.author?.trim() || "Tim Redaksi Medis RSIA Sayang Ibu",
      content: formData.content?.trim() || "<p></p>",
      image: formData.image?.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    };

    if (editingArticle) {
      try {
        const res = await api.articles.update(editingArticle.id, payload);
        if (res?.data) {
          await fetchArticles(true);
        } else {
          setArticles(articles.map((a) => (a.id === editingArticle.id ? { ...a, ...payload } as Article : a)));
        }
      } catch (err) {
        console.warn("API update article failed, updating store locally:", err);
        setArticles(articles.map((a) => (a.id === editingArticle.id ? { ...a, ...payload } as Article : a)));
      }
    } else {
      try {
        const res = await api.articles.create(payload);
        if (res?.data) {
          await fetchArticles(true);
        } else {
          const newArticle: Article = {
            ...payload,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          } as Article;
          setArticles([newArticle, ...articles]);
        }
      } catch (err) {
        console.warn("API create article failed, adding to store locally:", err);
        const newArticle: Article = {
          ...payload,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        } as Article;
        setArticles([newArticle, ...articles]);
      }
    }
    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await api.articles.delete(id);
        await fetchArticles(true);
      } catch (err) {
        console.warn("API delete article failed, deleting locally:", err);
        setArticles(articles.filter((a) => a.id !== id));
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Artikel</h2>
          <p className="text-xs sm:text-sm text-slate-500">Manajemen publikasi berita dan artikel edukasi kesehatan ibu & anak.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Tulis Artikel
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari judul artikel..." 
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())).length}</strong> artikel
          </div>
        </div>

        {/* Mobile View: Responsive Card List */}
        <div className="block md:hidden divide-y divide-slate-100">
          {articles.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada artikel. Klik "Tulis Artikel" untuk membuat publikasi edukasi baru.
            </div>
          )}
          {articles
            .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()))
            .map((article) => (
              <div key={article.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-primary">{article.category}</span>
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mt-0.5">{article.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{article.date}</p>
                  </div>
                  <Badge variant={article.status === "Published" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                    {article.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/70">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenModal(article)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {/* Desktop View: Structured Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Judul Artikel</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                    Belum ada artikel. Klik "Tulis Artikel" untuk membuat publikasi edukasi baru.
                  </TableCell>
                </TableRow>
              )}
              {articles
                .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()))
                .map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <span className="line-clamp-1">{article.title}</span>
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{article.date}</TableCell>
                    <TableCell>
                      <Badge variant={article.status === "Published" ? "default" : "secondary"}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit" onClick={() => handleOpenModal(article)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-rose-50 rounded-lg" title="Hapus" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "Edit Artikel Edukasi" : "Tulis Artikel Baru"}
        description="Kelola publikasi wawasan medis, tips kesehatan ibu dan anak, serta panduan layanan klinis."
        icon={<Newspaper className="w-5 h-5 text-primary" />}
        size="4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Artikel
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Section 1: Metadata & Sampul */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <FileText className="w-4 h-4 text-primary" />
              <span>Metadata & Informasi Publikasi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Gambar Sampul (Thumbnail)</Label>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <ImageUpload 
                    value={formData.image || ""} 
                    onChange={(val) => setFormData({ ...formData, image: val })} 
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">Format landscape rasio 16:9 disarankan</p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Judul Artikel Medis <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title || ""} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="Contoh: Mengenal Manfaat Metode ERACS untuk Persalinan Caesar yang Cepat dan Nyaman"
                    className="h-10 bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-semibold text-slate-700">Kategori Artikel</Label>
                    <select 
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={formData.category || "Kebidanan & Kandungan"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Kebidanan & Kandungan">Kebidanan & Kandungan</option>
                      <option value="Kesehatan Anak">Kesehatan Anak</option>
                      <option value="Kehamilan">Kehamilan</option>
                      <option value="Nutrisi & Gizi">Nutrisi & Gizi</option>
                      <option value="Tips Sehat">Tips Sehat</option>
                      <option value="Info Layanan">Info Layanan</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Publikasi</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:bg-slate-100"
                      value={formData.status || "Draft"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Published" | "Draft" })}
                      disabled={isEditor}
                    >
                      <option value="Draft">Draft (Disimpan Sementara)</option>
                      <option value="Published">Published (Tayang di Website)</option>
                    </select>
                    {isEditor && (
                      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Role Editor hanya dapat menyimpan draft.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="author" className="text-xs font-semibold text-slate-700">Penulis / Reviewer Medis</Label>
                    <div className="relative">
                      <Input 
                        id="author" 
                        value={formData.author || ""} 
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                        placeholder="Contoh: dr. Amanda Saraswati, Sp.OG"
                        className="h-10 bg-white pr-9"
                      />
                      <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-xs font-semibold text-slate-700">Tanggal Tayang</Label>
                    <div className="relative">
                      <Input 
                        id="date" 
                        value={formData.date || ""} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                        placeholder="Contoh: 14 Okt 2024"
                        className="h-10 bg-white pr-9"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tags" className="text-xs font-semibold text-slate-700">Topik / Kata Kunci Tag (Pisahkan dengan koma)</Label>
                  <div className="relative">
                    <Input 
                      id="tags" 
                      value={tagsText} 
                      onChange={(e) => setTagsText(e.target.value)} 
                      placeholder="Contoh: ERACS, Persalinan Caesar, Obgyn, Pemulihan Cepat, RSIA Sayang Ibu"
                      className="h-10 bg-white pr-9"
                    />
                    <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Editor Konten */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Naskah & Konten Lengkap Artikel</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Mendukung formatting heading, list, dan link</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <RichTextEditor 
                content={formData.content || ""} 
                onChange={(content) => setFormData({ ...formData, content })} 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
