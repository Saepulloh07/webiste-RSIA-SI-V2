import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Stethoscope, Calendar, GraduationCap, UserCheck, FileText, Loader2 } from "lucide-react";
import { useStore, Doctor } from "@/store";
import { ImageUpload } from "@/components/ui/image-upload";
import { api } from "@/app/api";

export default function ManageDoctors() {
  const [search, setSearch] = useState("");
  const { doctors, setDoctors, fetchDoctors } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({});
  const [educationText, setEducationText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleOpenModal = (doc?: Doctor) => {
    if (doc) {
      setEditingDoctor(doc);
      setFormData(doc);
      setEducationText(doc.education ? doc.education.join("\n") : "");
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "",
        specialty: "Kandungan",
        status: "Aktif",
        schedule: "",
        image: "",
        sipNumber: "",
        poliklinik: "",
        subspecialty: "",
        bio: ""
      });
      setEducationText("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const parsedEducation = educationText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload = {
      name: formData.name?.trim() || "",
      specialty: formData.specialty || "Kandungan",
      subspecialty: formData.subspecialty?.trim() || undefined,
      status: formData.status || "Aktif",
      schedule: formData.schedule?.trim() || "",
      image: formData.image?.trim() || undefined,
      sipNumber: formData.sipNumber?.trim() || undefined,
      poliklinik: formData.poliklinik?.trim() || undefined,
      bio: formData.bio?.trim() || undefined,
      education: parsedEducation.length > 0 ? parsedEducation : undefined,
    };

    if (editingDoctor) {
      try {
        const res = await api.doctors.update(editingDoctor.id, payload);
        if (res?.data) {
          await fetchDoctors();
        } else {
          setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? { ...d, ...payload } as Doctor : d)));
        }
      } catch (err) {
        console.warn("API update doctor failed, updating store locally:", err);
        setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? { ...d, ...payload } as Doctor : d)));
      }
    } else {
      try {
        const res = await api.doctors.create(payload);
        if (res?.data) {
          await fetchDoctors();
        } else {
          setDoctors([{ ...payload, id: Date.now().toString() } as Doctor, ...doctors]);
        }
      } catch (err) {
        console.warn("API create doctor failed, adding to store locally:", err);
        setDoctors([{ ...payload, id: Date.now().toString() } as Doctor, ...doctors]);
      }
    }
    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokter ini dari direktori?")) {
      try {
        await api.doctors.delete(id);
        await fetchDoctors();
      } catch (err) {
        console.warn("API delete doctor failed, deleting locally:", err);
        setDoctors(doctors.filter((d) => d.id !== id));
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Dokter</h2>
          <p className="text-xs sm:text-sm text-slate-500">Manajemen direktori, spesialisasi, dan jadwal praktik dokter.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Tambah Dokter
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari dokter atau spesialis..." 
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())).length}</strong> dokter
          </div>
        </div>

        {/* Mobile View: Responsive Card List */}
        <div className="block md:hidden divide-y divide-slate-100">
          {doctors.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada dokter terdaftar. Klik "Tambah Dokter" untuk menambahkan dokter baru.
            </div>
          )}
          {doctors
            .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
            .map((doc) => (
              <div key={doc.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {doc.image ? (
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                          {doc.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm leading-snug truncate">{doc.name}</h4>
                      <p className="text-xs text-primary font-medium truncate">{doc.specialty}</p>
                    </div>
                  </div>
                  <Badge variant={doc.status === "Aktif" ? "default" : doc.status === "Cuti" ? "outline" : "secondary"} className="shrink-0 text-[10px]">
                    {doc.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/70">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenModal(doc)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Data</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(doc.id)}
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
                <TableHead>Nama Dokter</TableHead>
                <TableHead>Spesialisasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                    Belum ada dokter terdaftar. Klik "Tambah Dokter" untuk menambahkan dokter baru.
                  </TableCell>
                </TableRow>
              )}
              {doctors
                .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
                .map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {doc.image ? (
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                              {doc.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.specialty}</TableCell>
                    <TableCell>
                      <Badge variant={doc.status === "Aktif" ? "default" : doc.status === "Cuti" ? "outline" : "secondary"}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleOpenModal(doc)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-rose-50 rounded-lg" onClick={() => handleDelete(doc.id)}>
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
        title={editingDoctor ? "Edit Profil Dokter" : "Tambah Dokter Baru"}
        description="Kelola informasi profil, surat izin praktik, jadwal rutin, dan riwayat klinis dokter."
        icon={<Stethoscope className="w-5 h-5 text-primary" />}
        size="3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Dokter
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Section 1: Profil Utama & Foto */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Identitas & Spesialisasi Medis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Foto Profil Dokter</Label>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <ImageUpload 
                    value={formData.image || ""} 
                    onChange={(val) => setFormData({ ...formData, image: val })} 
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">Gunakan foto berlatar bersih rasio 1:1 atau 3:4</p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span></Label>
                  <Input 
                    id="name" 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Contoh: dr. Amanda Saraswati, Sp.OG, Subsp. Obginsos"
                    className="h-10 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="specialty" className="text-xs font-semibold text-slate-700">Spesialisasi Pokok</Label>
                    <select 
                      id="specialty"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={formData.specialty || "Kandungan"}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    >
                      <option value="Kandungan">Kandungan & Kebidanan (Obgyn)</option>
                      <option value="Anak">Spesialis Anak (Pediatri)</option>
                      <option value="Penyakit Dalam">Penyakit Dalam (Internis)</option>
                      <option value="Umum">Dokter Umum / IGD</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Praktik</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={formData.status || "Aktif"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Doctor["status"] })}
                    >
                      <option value="Aktif">Aktif Praktik</option>
                      <option value="Cuti">Sedang Cuti</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="sipNumber" className="text-xs font-semibold text-slate-700">Nomor SIP / Izin Praktik</Label>
                    <Input 
                      id="sipNumber" 
                      value={formData.sipNumber || ""} 
                      onChange={(e) => setFormData({ ...formData, sipNumber: e.target.value })} 
                      placeholder="Contoh: 503/SIP.DS/DPM-PTSP/2023"
                      className="h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="poliklinik" className="text-xs font-semibold text-slate-700">Poliklinik / Ruang Praktik</Label>
                    <Input 
                      id="poliklinik" 
                      value={formData.poliklinik || ""} 
                      onChange={(e) => setFormData({ ...formData, poliklinik: e.target.value })} 
                      placeholder="Contoh: Poli Obgyn Lantai 2"
                      className="h-10 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subspecialty" className="text-xs font-semibold text-slate-700">Sub-Spesialis / Layanan Unggulan</Label>
                  <Input 
                    id="subspecialty" 
                    value={formData.subspecialty || ""} 
                    onChange={(e) => setFormData({ ...formData, subspecialty: e.target.value })} 
                    placeholder="Contoh: Fetomaternal, ERACS & Fertilitas"
                    className="h-10 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Jadwal Praktik */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Jadwal Praktik & Ketersediaan</span>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="schedule" className="text-xs font-semibold text-slate-700">Jadwal Praktik Rutin</Label>
              <Input 
                id="schedule" 
                value={formData.schedule || ""} 
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} 
                placeholder="Contoh: Senin - Kamis: 09:00 - 13:00 WIB, Jumat: 14:00 - 17:00 WIB"
                className="h-10 bg-white"
              />
              <p className="text-[11px] text-slate-500">Jadwal ini ditampilkan pada pencarian dokter dan kartu reservasi janji temu pasien.</p>
            </div>
          </div>

          {/* Section 3: Biografi & Riwayat Pendidikan */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Biografi Klinis & Riwayat Pendidikan</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">Profil Singkat & Dedikasi Dokter</Label>
                <textarea 
                  id="bio" 
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={formData.bio || ""} 
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                  placeholder="Tuliskan latar belakang singkat mengenai pengalaman dan dedikasi klinis dokter..."
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="education" className="text-xs font-semibold text-slate-700">Riwayat Pendidikan & Organisasi Profesi</Label>
                  <span className="text-[11px] text-slate-400">1 baris per institusi / gelar</span>
                </div>
                <textarea 
                  id="education" 
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={educationText} 
                  onChange={(e) => setEducationText(e.target.value)} 
                  placeholder="Contoh:&#10;Spesialis Obstetri & Ginekologi - FK Universitas Andalas&#10;Pendidikan Dokter Umum - Universitas Padjadjaran&#10;Anggota POGI & IDI Cabang Sumatera Barat"
                />
                <p className="text-[11px] text-slate-500">Otomatis diformat menjadi poin-poin terstruktur pada tab profil dokter.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
