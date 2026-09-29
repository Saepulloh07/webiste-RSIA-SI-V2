import { useState, useEffect, useRef } from "react";
import { Save, Globe, MapPin, Phone, Mail, Clock, Share2, Check, Loader2, Images, UploadCloud, Trash2, GripVertical, Video, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, AppSettings } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";
import { api } from "@/app/api";
import { parseVideoSource } from "@/utils/video";
import { alertSuccess, alertError, alertConfirm, extractApiErrorMessage } from "@/utils/alert";

export default function ManageSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, fetchSettings, media, fetchMedia } = useStore();
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingSlide, setIsUploadingSlide] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchMedia();
  }, [fetchSettings, fetchMedia]);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Gambar-gambar yang akan tampil bergantian (slideshow) di Hero Section Beranda.
  const slideshowImages = media.filter((m) => m.type === "slideshow");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.settings.updateHospital(formData);
      await fetchSettings();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
      await alertSuccess("Pengaturan berhasil disimpan");
    } catch (err) {
      // Pengaturan ini dipakai website publik, jadi harus tersimpan di server.
      // Jangan disimpan lokal saja (terlihat berhasil padahal pengunjung tidak melihat perubahan).
      console.warn("API update settings failed:", err);
      await alertError(
        "Pengaturan gagal disimpan",
        extractApiErrorMessage(err, "Server tidak dapat dihubungi. Perubahan belum tersimpan di database.")
      );
    }
    setIsSaving(false);
  };

  // Unggah file video langsung (mp4/webm). Ukuran maksimum mengikuti UPLOAD_MAX_SIZE_MB di server.
  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      await alertError("File tidak didukung", "Hanya file video (MP4, WebM) yang dapat diunggah.");
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
      return;
    }

    setIsUploadingVideo(true);
    try {
      const res = await api.media.upload(file, "video", "Video profil Beranda");
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, videoUrl: res.data.url }));
        await alertSuccess("Video berhasil diunggah", "Klik \"Simpan Perubahan\" agar video tampil di Beranda.");
      }
    } catch (err) {
      await alertError(
        "Gagal mengunggah video",
        extractApiErrorMessage(err, "Periksa ukuran file (batas server) dan koneksi Anda, lalu coba lagi.")
      );
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    }
  };

  const videoSource = parseVideoSource(formData.videoUrl);

  const handleUploadSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      await alertError("File tidak didukung", "Hanya file gambar (JPG, PNG, WebP) yang dapat diunggah.");
      if (slideFileInputRef.current) slideFileInputRef.current.value = "";
      return;
    }

    setIsUploadingSlide(true);
    try {
      const res = await api.media.upload(file, "slideshow", "Gambar slideshow Beranda");
      if (res?.data) {
        await fetchMedia();
        await alertSuccess("Gambar slideshow berhasil ditambahkan");
      }
    } catch (err) {
      await alertError("Gagal mengunggah gambar", extractApiErrorMessage(err, "Periksa koneksi Anda lalu coba lagi."));
    } finally {
      setIsUploadingSlide(false);
      if (slideFileInputRef.current) slideFileInputRef.current.value = "";
    }
  };

  const handleDeleteSlide = async (id: string) => {
    const confirmed = await alertConfirm(
      "Hapus gambar slideshow ini?",
      "Gambar akan langsung hilang dari slideshow Beranda.",
      "Ya, hapus",
      "Batal"
    );
    if (!confirmed) return;

    try {
      await api.media.delete(id);
      await fetchMedia();
      await alertSuccess("Gambar slideshow berhasil dihapus");
    } catch (err) {
      await alertError("Gagal menghapus gambar", extractApiErrorMessage(err, "Periksa koneksi Anda lalu coba lagi."));
    }
  };

  const navItems = [
    { id: 'general', label: 'Informasi Umum', icon: Globe },
    { id: 'contact', label: 'Kontak & Email', icon: Phone },
    { id: 'location', label: 'Lokasi & Peta', icon: MapPin },
    { id: 'social', label: 'Sosial Media', icon: Share2 },
    { id: 'hero-slideshow', label: 'Slideshow Beranda', icon: Images },
    { id: 'video', label: 'Video Profil', icon: Video },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Pengaturan Web</h2>
          <p className="text-xs sm:text-sm text-slate-500">Atur informasi global yang ditampilkan pada website publik.</p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Tersimpan!
            </span>
          )}
          <Button onClick={handleSave} className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm font-semibold">
            <Save className="w-4 h-4" /> Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Tabs: horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className="w-full md:w-60 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-1.5 sm:p-2 h-fit shadow-2xs">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-colors shrink-0 ${isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs">
          <form onSubmit={handleSave}>

            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-heading border-b border-slate-100 pb-3">Informasi Umum</h3>
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Nama Rumah Sakit</Label>
                    <Input value={formData.hospitalName} onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi Singkat (Slogan)</Label>
                    <Input value={formData.slogan} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} />
                    <p className="text-xs text-muted-foreground">Ditampilkan sebagai kutipan singkat di Hero Section halaman Beranda.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Teks Tentang Kami (Singkat)</Label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      rows={3}
                      value={formData.aboutText || ""}
                      onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <Label>Jam Operasional Utama</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <Input value={formData.operationalHours} onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label>Logo Website</Label>
                    <ImageUpload
                      value={formData.logoUrl}
                      onChange={(val) => setFormData({ ...formData, logoUrl: val })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-heading border-b border-slate-100 pb-3">Kontak & Email</h3>
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Nomor Telepon (CS/Informasi)</Label>
                    <Input value={formData.phoneCs} onChange={(e) => setFormData({ ...formData, phoneCs: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor IGD / Darurat</Label>
                    <Input value={formData.phoneEmergency} onChange={(e) => setFormData({ ...formData, phoneEmergency: e.target.value })} className="font-semibold text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor WhatsApp (Pendaftaran & Info)</Label>
                    <Input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                    <p className="text-xs text-muted-foreground">Format nomor internasional (+62) tanpa spasi. Digunakan untuk tombol mengambang WA.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Resmi</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-heading border-b border-slate-100 pb-3">Lokasi & Peta</h3>
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Alamat Lengkap</Label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <Label>Tautan Google Maps</Label>
                    <Input value={formData.mapsUrl} onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Maps Embed (Iframe)</Label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 font-mono text-xs"
                      rows={4}
                      value={formData.mapsEmbed}
                      onChange={(e) => setFormData({ ...formData, mapsEmbed: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <Label>Gambar Peta (tampil di Beranda)</Label>
                    <ImageUpload
                      value={formData.mapsImageUrl ?? ""}
                      onChange={(val) => setFormData({ ...formData, mapsImageUrl: val })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Gambar latar pada kartu lokasi di bagian Kontak Beranda. Disarankan tangkapan layar peta lokasi
                      rumah sakit (rasio lanskap, mis. 1200×600). Kosongkan untuk memakai gambar default. Tombol
                      &quot;Buka di Google Maps&quot; tetap menggunakan Tautan Google Maps di atas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-heading border-b border-slate-100 pb-3">Sosial Media</h3>
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook Page URL</Label>
                    <Input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube Channel URL</Label>
                    <Input value={formData.youtube} onChange={(e) => setFormData({ ...formData, youtube: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tiktok URL</Label>
                    <Input value={formData.tiktok} onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })} placeholder="https://tiktok.com/..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hero-slideshow' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-heading">Slideshow Beranda</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atur gambar-gambar yang tampil bergantian (slideshow) pada Hero Section halaman Beranda publik.
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={slideFileInputRef}
                      className="hidden"
                      onChange={handleUploadSlide}
                    />
                    <Button
                      type="button"
                      onClick={() => slideFileInputRef.current?.click()}
                      disabled={isUploadingSlide}
                      className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm font-semibold"
                    >
                      {isUploadingSlide ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      Tambah Gambar
                    </Button>
                  </div>
                </div>

                {slideshowImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                    <Images className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium text-slate-500">Belum ada gambar slideshow.</p>
                    <p className="text-xs text-slate-400 mt-1">Halaman Beranda akan menampilkan 1 gambar banner default sampai Anda menambahkan gambar di sini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {slideshowImages.map((item, idx) => (
                      <div key={item.id} className="group relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50 aspect-video">
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <GripVertical className="w-3 h-3" /> #{idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(item.id)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-slate-700 hover:text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus dari slideshow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  Tips: gunakan gambar beresolusi tinggi dengan rasio 1:1 atau 4:5 agar terlihat optimal pada Hero Section. Urutan tampil mengikuti urutan unggah.
                  Gambar yang sama juga dapat dikelola lewat menu <strong>Media Library</strong> (filter "Slideshow").
                </p>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-heading border-b border-slate-100 pb-3">Video Profil Beranda</h3>
                <p className="text-xs text-slate-500 -mt-3">
                  Video pada bagian &quot;Mengenal Kami — Tur Fasilitas &amp; Edukasi Medis&quot; di halaman Beranda.
                  Bagian ini disembunyikan sampai URL video diisi.
                </p>

                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>URL Video</Label>
                    <Input
                      value={formData.videoUrl ?? ""}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Tempel tautan YouTube (watch, youtu.be, shorts) atau tautan langsung file video (.mp4 / .webm).
                    </p>

                    {formData.videoUrl?.trim() ? (
                      videoSource ? (
                        <p className="text-xs font-medium flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {videoSource.kind === "youtube" && "Video YouTube terdeteksi."}
                          {videoSource.kind === "file" && "File video langsung terdeteksi."}
                          {videoSource.kind === "external" && "Tautan eksternal — akan dibuka di tab baru (tidak dapat diputar di dalam halaman)."}
                        </p>
                      ) : (
                        <p className="text-xs font-medium flex items-center gap-1.5 text-rose-600">
                          <AlertCircle className="w-3.5 h-3.5" />
                          URL tidak valid. Gunakan tautan lengkap yang diawali https://
                        </p>
                      )
                    ) : null}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        ref={videoFileInputRef}
                        className="hidden"
                        onChange={handleUploadVideo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => videoFileInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="gap-2 rounded-xl"
                      >
                        {isUploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        Unggah File Video
                      </Button>
                      {formData.videoUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setFormData({ ...formData, videoUrl: "" })}
                          className="gap-2 rounded-xl text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus Video
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Ukuran unggahan dibatasi server (default 5 MB). Untuk video besar, unggah ke YouTube lalu tempel tautannya.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Judul Video</Label>
                    <Input
                      value={formData.videoTitle ?? ""}
                      onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder={`Company Profile ${formData.hospitalName || "RSIA Sayang Ibu Batusangkar"}`}
                    />
                    <p className="text-xs text-muted-foreground">Kosongkan untuk memakai judul default.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Thumbnail Video (opsional)</Label>
                    <ImageUpload
                      value={formData.videoThumbnailUrl ?? ""}
                      onChange={(val) => setFormData({ ...formData, videoThumbnailUrl: val })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Untuk video YouTube, thumbnail otomatis dipakai jika dikosongkan. Rasio disarankan 16:9.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Klik <strong>Simpan Perubahan</strong> di bagian atas halaman agar perubahan tampil di website publik.
                </p>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}