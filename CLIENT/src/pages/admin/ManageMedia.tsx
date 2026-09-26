import { useState, useRef, useEffect } from "react";
import { Search, UploadCloud, Folder, FileImage, FileVideo, File, Trash2, Link as LinkIcon, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, MediaItem } from "@/store";
import { api } from "@/app/api";
import { alertSuccess, alertError, alertWarning, alertConfirm, extractApiErrorMessage } from "@/utils/alert";

export default function MediaLibrary() {
  const [search, setSearch] = useState("");
  const { media, setMedia, fetchMedia } = useStore();
  const [filter, setFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = async (id: string) => {
    const confirmed = await alertConfirm(
      "Hapus berkas ini?",
      "Berkas akan dihapus permanen dari server dan tidak dapat dikembalikan.",
      "Ya, hapus",
      "Batal"
    );
    if (!confirmed) return;

    try {
      await api.media.delete(id);
      await fetchMedia();
      await alertSuccess("Berkas berhasil dihapus");
    } catch (err) {
      console.warn("API delete media failed, deleting locally:", err);
      setMedia(media.filter(m => m.id !== id));
      await alertWarning("Terhapus secara lokal", extractApiErrorMessage(err, "Server tidak dapat dihubungi."));
    }
  };

  const handleCopy = (id: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const targetType = filter !== 'all' ? filter : 'website_image';
      try {
        const res = await api.media.upload(file, targetType);
        if (res?.data) {
          await fetchMedia();
          await alertSuccess("Media berhasil diunggah");
        }
      } catch (err) {
        console.warn("API upload failed, storing locally as preview:", err);
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const newItem: MediaItem = {
            id: Date.now().toString(),
            name: file.name,
            type: targetType as any,
            url: result,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            date: new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })
          };
          setMedia([newItem, ...media]);
        };
        reader.readAsDataURL(file);
        await alertWarning("Tersimpan sementara di perangkat ini", extractApiErrorMessage(err, "Server tidak dapat dihubungi."));
      } finally {
        setIsUploading(false);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredMedia = media.filter(
    item => (filter === 'all' || item.type === filter) && item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Media Library</h2>
          <p className="text-xs sm:text-sm text-slate-500">Kelola gambar, banner, dan dokumen website Anda.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm font-semibold"
          >
            <UploadCloud className="w-4 h-4" /> Unggah Media
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama berkas..."
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'slideshow', label: 'Slideshow' },
              { id: 'website_image', label: 'Gambar Website' },
              { id: 'video', label: 'Video' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${filter === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid / Content */}
        <div className="p-3.5 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id} className="group relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50 flex flex-col aspect-square hover:shadow-md transition-all">
                <div className="flex-1 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                  {(item.type === 'slideshow' || item.type === 'website_image' || item.type === 'image') && item.url ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : item.type === 'video' ? (
                    <FileVideo className="w-10 h-10 text-slate-400" />
                  ) : (
                    <File className="w-10 h-10 text-slate-400" />
                  )}

                  {/* Actions: Always visible on mobile, visible on hover for desktop */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`p-1.5 rounded-lg shadow-sm backdrop-blur-sm transition-colors ${copiedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/95 text-slate-700 hover:text-primary'
                        }`}
                      title="Salin URL"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-slate-700 hover:text-rose-600 shadow-sm transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {copiedId === item.id && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Tersalin!
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-2.5 border-t border-slate-100 bg-white">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>{item.name}</p>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">{item.size}</span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="flex flex-col items-center justify-center text-slate-400 py-12">
              <Folder className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-xs sm:text-sm">Tidak ada berkas media ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}