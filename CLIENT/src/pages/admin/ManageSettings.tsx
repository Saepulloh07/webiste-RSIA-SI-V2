import { useState, useEffect } from "react";
import { Save, Globe, MapPin, Phone, Mail, Clock, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, AppSettings } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ManageSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, setSettings } = useStore();
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const navItems = [
    { id: 'general', label: 'Informasi Umum', icon: Globe },
    { id: 'contact', label: 'Kontak & Email', icon: Phone },
    { id: 'location', label: 'Lokasi & Peta', icon: MapPin },
    { id: 'social', label: 'Sosial Media', icon: Share2 },
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
                  className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                    isActive
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
                    <Input value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi Singkat (Slogan)</Label>
                    <Input value={formData.slogan} onChange={(e) => setFormData({...formData, slogan: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Teks Tentang Kami (Singkat)</Label>
                    <textarea 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      rows={3}
                      value={formData.aboutText || ""}
                      onChange={(e) => setFormData({...formData, aboutText: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <Label>Jam Operasional Utama</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <Input value={formData.operationalHours} onChange={(e) => setFormData({...formData, operationalHours: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label>Logo Website</Label>
                    <ImageUpload 
                      value={formData.logoUrl} 
                      onChange={(val) => setFormData({...formData, logoUrl: val})} 
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
                    <Input value={formData.phoneCs} onChange={(e) => setFormData({...formData, phoneCs: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor IGD / Darurat</Label>
                    <Input value={formData.phoneEmergency} onChange={(e) => setFormData({...formData, phoneEmergency: e.target.value})} className="font-semibold text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor WhatsApp (Pendaftaran & Info)</Label>
                    <Input value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                    <p className="text-xs text-muted-foreground">Format nomor internasional (+62) tanpa spasi. Digunakan untuk tombol mengambang WA.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Resmi</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" />
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
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <Label>Tautan Google Maps</Label>
                    <Input value={formData.mapsUrl} onChange={(e) => setFormData({...formData, mapsUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Maps Embed (Iframe)</Label>
                    <textarea 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 font-mono text-xs"
                      rows={4}
                      value={formData.mapsEmbed}
                      onChange={(e) => setFormData({...formData, mapsEmbed: e.target.value})}
                    ></textarea>
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
                    <Input value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook Page URL</Label>
                    <Input value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube Channel URL</Label>
                    <Input value={formData.youtube} onChange={(e) => setFormData({...formData, youtube: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tiktok URL</Label>
                    <Input value={formData.tiktok} onChange={(e) => setFormData({...formData, tiktok: e.target.value})} placeholder="https://tiktok.com/..." />
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
