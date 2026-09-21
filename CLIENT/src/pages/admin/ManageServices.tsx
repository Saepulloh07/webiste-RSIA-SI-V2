import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Activity, Clock, CheckCircle2, Building2, Layers } from "lucide-react";
import { useStore, Service } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ManageServices() {
  const [search, setSearch] = useState("");
  const { services, setServices } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  const [facilitiesText, setFacilitiesText] = useState("");

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
      setFacilitiesText(service.facilities ? service.facilities.join("\n") : "");
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        category: "Poliklinik",
        status: "Aktif",
        description: "",
        operationalHours: "Senin - Sabtu, 08:00 - 16:00",
        image: ""
      });
      setFacilitiesText("");
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const parsedFacilities = facilitiesText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const updatedData: Partial<Service> = {
      ...formData,
      facilities: parsedFacilities
    };

    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...updatedData } as Service : s)));
    } else {
      setServices([{ ...updatedData, id: Date.now().toString() } as Service, ...services]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Layanan</h2>
          <p className="text-xs sm:text-sm text-slate-500">Manajemen informasi poliklinik dan layanan medis rumah sakit.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Tambah Layanan
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari layanan medis..." 
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())).length}</strong> layanan
          </div>
        </div>

        {/* Mobile View: Responsive Card List */}
        <div className="block md:hidden divide-y divide-slate-100">
          {services.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada layanan terdaftar. Klik "Tambah Layanan" untuk menambahkan data baru.
            </div>
          )}
          {services
            .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
            .map((service) => (
              <div key={service.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug">{service.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{service.category}</p>
                  </div>
                  <Badge variant={service.status === "Aktif" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                    {service.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/70">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenModal(service)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Data</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(service.id)}
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
                <TableHead>Nama Layanan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                    Belum ada layanan terdaftar. Klik "Tambah Layanan" untuk menambahkan data baru.
                  </TableCell>
                </TableRow>
              )}
              {services
                .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
                .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      <Badge variant={service.status === "Aktif" ? "default" : "secondary"}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleOpenModal(service)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-rose-50 rounded-lg" onClick={() => handleDelete(service.id)}>
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
        title={editingService ? "Edit Layanan Medis" : "Tambah Layanan Medis Baru"}
        description="Kelola informasi poliklinik, unit gawat darurat, fasilitas tindakan, dan jam ketersediaan layanan."
        icon={<Activity className="w-5 h-5 text-primary" />}
        size="3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Layanan
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Section 1: Data Pokok Layanan */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Identitas & Klasifikasi Layanan</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Foto / Banner Layanan</Label>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <ImageUpload 
                    value={formData.image || ""} 
                    onChange={(val) => setFormData({ ...formData, image: val })} 
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">Rasio 16:9 atau 4:3 foto ruangan/layanan</p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nama Layanan Medis <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="name" 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Contoh: Poliklinik Kebidanan & Kandungan (Obgyn)"
                    className="h-10 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-semibold text-slate-700">Kategori Unit</Label>
                    <select 
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={formData.category || "Poliklinik"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Poliklinik">Poliklinik</option>
                      <option value="Gawat Darurat">Gawat Darurat</option>
                      <option value="Penunjang Medis">Penunjang Medis</option>
                      <option value="Kamar Bersalin">Kamar Bersalin (VK)</option>
                      <option value="Rawat Inap">Rawat Inap</option>
                      <option value="Layanan Khusus">Layanan Khusus</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Layanan</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={formData.status || "Aktif"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Aktif" | "Nonaktif" })}
                    >
                      <option value="Aktif">Aktif Beroperasi</option>
                      <option value="Nonaktif">Nonaktif / Perbaikan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="operationalHours" className="text-xs font-semibold text-slate-700">Jam Operasional & Kesiapsiagaan</Label>
                  <div className="relative">
                    <Input 
                      id="operationalHours" 
                      value={formData.operationalHours || ""} 
                      onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })} 
                      placeholder="Contoh: 24 Jam Penuh (IGD) atau Senin - Sabtu: 08:00 - 20:00 WIB"
                      className="h-10 bg-white pr-10"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Deskripsi & Pelayanan */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Deskripsi & Ruang Lingkup Layanan</span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Ringkasan Pelayanan</Label>
              <textarea 
                id="description" 
                rows={3}
                className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={formData.description || ""} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Jelaskan mengenai keunggulan, cakupan pasien, dan standar mutu penanganan pelayanan medis ini..."
              />
            </div>
          </div>

          {/* Section 3: Fasilitas & Tindakan */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fasilitas & Tindakan Medis Unggulan</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">1 baris per tindakan/alat</span>
            </div>

            <div className="space-y-1.5">
              <textarea 
                id="facilities" 
                rows={4}
                className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={facilitiesText} 
                onChange={(e) => setFacilitiesText(e.target.value)} 
                placeholder="Contoh:&#10;Pemeriksaan USG 4D Fetomaternal Beresolusi Tinggi&#10;Persalinan Metode ERACS Minim Nyeri Cepat Pulih&#10;Ruang Isolasi Tekanan Negatif Khusus&#10;Inkubator Perinatologi Modern"
              />
              <p className="text-[11px] text-slate-500">Otomatis ditampilkan dengan ikon centang checklist hijau pada kartu detail layanan publik.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
