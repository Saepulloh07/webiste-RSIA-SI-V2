import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Eye, Briefcase, Building, MapPin, Calendar, Mail, Phone, FileCheck, CheckCircle2, Award, Loader2 } from "lucide-react";
import { useStore, JobVacancy } from "@/store";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { api } from "@/app/api";

export default function ManageVacancies() {
  const [search, setSearch] = useState("");
  const { vacancies, setVacancies, fetchVacancies } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const role = localStorage.getItem("adminRole") || "Editor";
  const isEditor = role === "Editor";

  useEffect(() => {
    fetchVacancies(true);
  }, [fetchVacancies]);

  const [formData, setFormData] = useState<Partial<JobVacancy>>({
    title: "",
    department: "",
    type: "Full Time",
    location: "Batusangkar",
    experience: "",
    deadline: "",
    contactEmail: "",
    contactWa: "",
    status: isEditor ? "Draft" : "Published",
    description: "",
    requirements: ""
  });

  const handleOpenModal = (vacancy?: JobVacancy) => {
    if (vacancy) {
      setEditingId(vacancy.id);
      setFormData(vacancy);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        department: "",
        type: "Full Time",
        location: "Batusangkar",
        experience: "Minimal 1 Tahun Pengalaman",
        deadline: "",
        contactEmail: "karir@sayangibu.co.id",
        contactWa: "",
        status: isEditor ? "Draft" : "Published",
        description: "",
        requirements: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.department) {
      alert("Mohon lengkapi judul dan departemen.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      type: (formData.type as "Full Time" | "Part Time" | "Kontrak") || "Full Time",
      location: formData.location?.trim() || "Batusangkar",
      experience: formData.experience?.trim() || undefined,
      deadline: formData.deadline?.trim() || undefined,
      contactEmail: formData.contactEmail?.trim() || undefined,
      contactWa: formData.contactWa?.trim() || undefined,
      status: (formData.status as "Published" | "Draft") || "Published",
      description: formData.description?.trim() || "",
      requirements: formData.requirements?.trim() || "",
    };

    if (editingId) {
      try {
        const res = await api.vacancies.update(editingId, payload);
        if (res?.data) {
          await fetchVacancies(true);
        } else {
          setVacancies(vacancies.map(v => v.id === editingId ? { ...v, ...payload } as JobVacancy : v));
        }
      } catch (err) {
        console.warn("API update vacancy failed, updating locally:", err);
        setVacancies(vacancies.map(v => v.id === editingId ? { ...v, ...payload } as JobVacancy : v));
      }
    } else {
      try {
        const res = await api.vacancies.create(payload);
        if (res?.data) {
          await fetchVacancies(true);
        } else {
          const newVacancy: JobVacancy = {
            id: Date.now().toString(),
            ...payload,
            date: new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })
          } as JobVacancy;
          setVacancies([newVacancy, ...vacancies]);
        }
      } catch (err) {
        console.warn("API create vacancy failed, adding locally:", err);
        const newVacancy: JobVacancy = {
          id: Date.now().toString(),
          ...payload,
          date: new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })
        } as JobVacancy;
        setVacancies([newVacancy, ...vacancies]);
      }
    }
    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus lowongan ini?")) {
      try {
        await api.vacancies.delete(id);
        await fetchVacancies(true);
      } catch (err) {
        console.warn("API delete vacancy failed, deleting locally:", err);
      }
      setVacancies(vacancies.filter(v => v.id !== id));
    }
  };

  const filteredVacancies = vacancies.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) || 
    v.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Lowongan Kerja</h2>
          <p className="text-xs sm:text-sm text-slate-500">Tambah, ubah, atau hapus lowongan karir rumah sakit.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Lowongan
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Cari posisi atau divisi..." 
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{filteredVacancies.length}</strong> posisi
          </div>
        </div>

        {/* Mobile View: Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredVacancies.map((vacancy) => (
            <div key={vacancy.id} className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-primary">{vacancy.department}</span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{vacancy.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">{vacancy.type}</span>
                    <span>•</span>
                    <span>{vacancy.date}</span>
                  </div>
                </div>
                <Badge variant={vacancy.status === "Published" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                  {vacancy.status}
                </Badge>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/70">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleOpenModal(vacancy)}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => handleDelete(vacancy.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
          ))}

          {filteredVacancies.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data lowongan ditemukan.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Posisi / Departemen</TableHead>
                <TableHead>Tipe Pekerjaan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVacancies.map((vacancy) => (
                <TableRow key={vacancy.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{vacancy.title}</div>
                    <div className="text-xs text-slate-500">{vacancy.department}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{vacancy.type}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">{vacancy.date}</TableCell>
                  <TableCell>
                    <Badge variant={vacancy.status === "Published" ? "default" : "secondary"}>
                      {vacancy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleOpenModal(vacancy)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg" onClick={() => handleDelete(vacancy.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVacancies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Tidak ada data lowongan ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Lowongan Karir" : "Tambah Lowongan Karir Baru"}
        description="Kelola rekrutmen tenaga medis & staf profesional RSIA Sayang Ibu Batusangkar."
        icon={<Briefcase className="w-5 h-5 text-primary" />}
        size="4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Lowongan
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Section 1: Posisi & Status */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>Posisi & Penempatan Unit</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Nama Posisi Lowongan <span className="text-rose-500">*</span></Label>
                <Input 
                  id="title"
                  value={formData.title || ""} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="Contoh: Dokter Umum IGD / Bidan Pelaksana"
                  className="h-10 bg-white font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-xs font-semibold text-slate-700">Departemen / Instalasi</Label>
                <Input 
                  id="department"
                  value={formData.department || ""} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                  placeholder="Contoh: Pelayanan Medis / Keperawatan"
                  className="h-10 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold text-slate-700">Tipe Kontrak</Label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={formData.type || "Full Time"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Kontrak">Kontrak</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-slate-700">Lokasi Kerja</Label>
                <div className="relative">
                  <Input 
                    id="location"
                    value={formData.location || ""} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    placeholder="Batusangkar"
                    className="h-10 bg-white pr-8"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
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
                  <option value="Published">Published (Buka Lamaran)</option>
                  <option value="Draft">Draft (Disimpan Sementara)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs font-semibold text-slate-700">Batas Akhir (Deadline)</Label>
                <div className="relative">
                  <Input 
                    id="deadline"
                    value={formData.deadline || ""} 
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                    placeholder="Contoh: 30 Nov 2024"
                    className="h-10 bg-white pr-8"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Saluran Rekrutmen */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Saluran Lamaran & Kualifikasi Pokok</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="experience" className="text-xs font-semibold text-slate-700">Kualifikasi Singkat</Label>
                <Input 
                  id="experience"
                  value={formData.experience || ""} 
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })} 
                  placeholder="Min. 1 Thn / Fresh Graduate"
                  className="h-10 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs font-semibold text-slate-700">Email Kirim Berkas</Label>
                <div className="relative">
                  <Input 
                    id="contactEmail"
                    value={formData.contactEmail || ""} 
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} 
                    placeholder="karir@sayangibu.co.id"
                    className="h-10 bg-white pr-8"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactWa" className="text-xs font-semibold text-slate-700">WhatsApp HRD (Opsional)</Label>
                <div className="relative">
                  <Input 
                    id="contactWa"
                    value={formData.contactWa || ""} 
                    onChange={(e) => setFormData({ ...formData, contactWa: e.target.value })} 
                    placeholder="+6281123456789"
                    className="h-10 bg-white pr-8"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Uraian Tugas (Job Description) */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Deskripsi Tanggung Jawab & Uraian Pekerjaan</span>
              </div>
              <span className="text-[11px] text-slate-400">Rincian tugas harian</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <RichTextEditor 
                content={formData.description || ""} 
                onChange={(content) => setFormData({ ...formData, description: content })} 
              />
            </div>
          </div>

          {/* Section 4: Kriteria & Persyaratan (Requirements) */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kriteria, Pendidikan & Berkas Persyaratan</span>
              </div>
              <span className="text-[11px] text-slate-400">STR aktif, ijazah, sertifikat</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <RichTextEditor 
                content={formData.requirements || ""} 
                onChange={(content) => setFormData({ ...formData, requirements: content })} 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
