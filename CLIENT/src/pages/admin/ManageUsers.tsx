import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ShieldCheck, User, Lock, Mail, Shield, KeyRound, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, UserAdmin } from "@/store";
import { api } from "@/app/api";
import { alertSuccess, alertError, alertWarning, alertConfirm, extractApiErrorMessage, isValidationError } from "@/utils/alert";

export default function ManageUsers() {
  const { users, setUsers, fetchUsers } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);
  const [formData, setFormData] = useState<Partial<UserAdmin>>({});
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user?: UserAdmin) => {
    setPassword("");
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "Editor",
        lastLogin: "Belum pernah login"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const name = formData.name?.trim() || "";
    const email = formData.email?.trim() || "";
    const role = formData.role || "Editor";

    if (!name) {
      await alertError("Data belum lengkap", "Nama pengguna wajib diisi.");
      return;
    }
    if (!email) {
      await alertError("Data belum lengkap", "Email pengguna wajib diisi.");
      return;
    }
    if (!editingUser && !password) {
      await alertError("Data belum lengkap", "Password wajib diisi untuk pengguna baru.");
      return;
    }

    setIsSaving(true);
    const payload: any = {
      name,
      email,
      role,
    };
    if (password) {
      payload.password = password;
    }

    try {
      if (editingUser) {
        const res = await api.users.update(editingUser.id, payload);
        if (res?.data) {
          await fetchUsers();
        } else {
          setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } as UserAdmin : u)));
        }
      } else {
        const res = await api.users.create({
          ...payload,
          password: password || "Password123!",
        });
        if (res?.data) {
          await fetchUsers();
        } else {
          setUsers([...users, { ...formData, id: Date.now().toString() } as UserAdmin]);
        }
      }
      setIsSaving(false);
      setIsModalOpen(false);
      await alertSuccess(editingUser ? "Pengguna berhasil diperbarui" : "Pengguna baru berhasil ditambahkan");
    } catch (err) {
      setIsSaving(false);

      if (isValidationError(err)) {
        await alertError("Validasi gagal", extractApiErrorMessage(err, "Periksa kembali format email dan password."));
        return;
      }

      console.warn("API user operation failed, updating locally:", err);
      if (editingUser) {
        setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } as UserAdmin : u)));
      } else {
        setUsers([...users, { ...formData, id: Date.now().toString() } as UserAdmin]);
      }
      setIsModalOpen(false);
      await alertWarning(
        "Tersimpan sementara di perangkat ini",
        "Server tidak dapat dihubungi. Perubahan disimpan di browser."
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await alertConfirm(
      "Hapus pengguna ini?",
      "Akun ini tidak akan dapat login lagi ke sistem CMS.",
      "Ya, hapus",
      "Batal"
    );
    if (!confirmed) return;

    try {
      await api.users.delete(id);
      await fetchUsers();
      await alertSuccess("Pengguna berhasil dihapus");
    } catch (err) {
      console.warn("API delete user failed, deleting locally:", err);
      setUsers(users.filter((u) => u.id !== id));
      await alertWarning("Terhapus lokal", "Server tidak dapat dihubungi. Perubahan disimpan sementara.");
    }
  };

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Kelola Pengguna CMS</h2>
          <p className="text-xs sm:text-sm text-slate-500">Manajemen akses dan wewenang akun pengelola sistem.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Tambah Pengguna
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-xs text-slate-500">
            Menampilkan <strong>{filteredUsers.length}</strong> pengguna
          </div>
        </div>
        
        {/* Mobile View: Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {users.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Belum ada data pengguna CMS. Klik "Tambah Pengguna" untuk menambahkan akun pengelola.
            </div>
          )}
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">{user.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                  user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {user.role === 'Super Admin' && <ShieldCheck className="w-2.5 h-2.5 mr-1" />}
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/70 text-xs text-slate-400">
                <span>Login: {user.lastLogin}</span>

                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2.5 text-xs gap-1 rounded-lg border-slate-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenModal(user)}
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border-slate-200"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada pengguna yang cocok.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Email Akses</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Aktivitas Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 text-xs">
                    Belum ada data pengguna CMS. Klik "Tambah Pengguna" untuk menambahkan akun pengelola.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role === 'Super Admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{user.lastLogin}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenModal(user)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
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
        title={editingUser ? "Edit Akses Pengguna" : "Tambah Pengguna Baru"}
        description="Atur identitas, kredensial login, dan tingkat otoritas pengelola CMS rumah sakit."
        icon={<ShieldCheck className="w-5 h-5 text-primary" />}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-6 font-semibold shadow-sm">
              Simpan Pengguna
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Section 1: Identitas & Kredensial */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <User className="w-4 h-4 text-primary" />
              <span>Identitas & Akun Pengguna</span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nama Lengkap & Gelar <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Contoh: Rahmat Hidayat, S.Kom"
                    className="h-10 bg-white pr-9"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Alamat Email Login <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email || ""} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    placeholder="nama@sayangibu.co.id"
                    className="h-10 bg-white pr-9"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  {editingUser ? "Kata Sandi Baru (Kosongkan jika tidak diubah)" : "Kata Sandi Default *"}
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUser ? "Masukkan kata sandi baru" : "Minimal 8 karakter kombinasi"}
                    className="h-10 bg-white pr-9"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400">Pengguna dapat mengganti kata sandi setelah berhasil login.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Level Otoritas & Peran */}
          <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 text-slate-800 font-semibold text-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Tingkat Otoritas & Hak Akses (Role)</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-semibold text-slate-700">Pilih Peran Sistem</Label>
              <select 
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={formData.role || "Editor"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserAdmin["role"] })}
              >
                <option value="Editor">Editor — Pengelolaan Konten, Berita, dan Banner</option>
                <option value="Admin">Admin — Manajemen Dokter, Layanan Medis, Jadwal & Karir</option>
                <option value="Super Admin">Super Admin — Akses Penuh Termasuk Manajemen Pengguna & Pengaturan Sistem</option>
              </select>
            </div>

            {/* Role guide badge summary */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className={`p-2.5 rounded-xl border text-center transition-all ${formData.role === "Editor" ? "bg-amber-50 border-amber-200 text-amber-900 font-semibold shadow-2xs" : "bg-white/60 border-slate-200 text-slate-500"}`}>
                <div className="font-bold">Editor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Artikel & Promo</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-center transition-all ${formData.role === "Admin" ? "bg-blue-50 border-blue-200 text-blue-900 font-semibold shadow-2xs" : "bg-white/60 border-slate-200 text-slate-500"}`}>
                <div className="font-bold">Admin</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dokter & Pelayanan</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-center transition-all ${formData.role === "Super Admin" ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold shadow-2xs" : "bg-white/60 border-slate-200 text-slate-500"}`}>
                <div className="font-bold">Super Admin</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Seluruh Fitur & Role</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
