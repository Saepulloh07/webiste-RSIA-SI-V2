import { useState, useEffect } from "react";
import { Settings, CheckCircle2, Clock, Calendar, XCircle, Search, User, Stethoscope, ChevronRight, Check, Trash2, Phone, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, Appointment } from "@/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { api } from "@/app/api";

export default function ManageAppointments() {
  const { appointments, updateAppointmentStatus, deleteAppointment, registrationSettings, setRegistrationSettings, fetchAppointments } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(registrationSettings);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAppointments();
    api.settings.getRegistration().then((res) => {
      if (res?.data) {
        setRegistrationSettings(res.data);
        setTempSettings(res.data);
      }
    }).catch(() => {});
  }, [fetchAppointments, setRegistrationSettings]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAppointments();
    setIsRefreshing(false);
  };

  const handleSaveSettings = async () => {
    try {
      await api.settings.updateRegistration(tempSettings);
    } catch (e) {
      console.warn("Failed saving registration settings to API, saving locally:", e);
    }
    setRegistrationSettings(tempSettings);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const handleStatusChange = async (id: string, status: Appointment["status"]) => {
    try {
      await api.appointments.update(id, { status });
      await fetchAppointments();
    } catch (e) {
      console.warn("Failed updating appointment status via API, updating locally:", e);
      updateAppointmentStatus(id, status);
    }
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pendaftaran ini?")) {
      try {
        await api.appointments.delete(id);
        await fetchAppointments();
      } catch (e) {
        console.warn("Failed deleting appointment via API, deleting locally:", e);
        deleteAppointment(id);
      }
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment(null);
      }
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const query = search.toLowerCase();
    const docName = (apt.doctorName || apt.doctorId || "").toLowerCase();
    const sName = (apt.serviceName || apt.serviceId || "").toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(query) ||
      docName.includes(query) ||
      sName.includes(query) ||
      apt.id.toLowerCase().includes(query) ||
      apt.phone.includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Pendaftaran Online</h2>
          <p className="text-xs sm:text-sm text-slate-500">Kelola antrean pasien dan pengaturan form pendaftaran publik.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto gap-2 bg-white border-slate-200 rounded-xl shadow-2xs font-semibold"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="w-4 h-4 text-slate-500" /> 
            <span>{isSettingsOpen ? "Tutup Pengaturan" : "Pengaturan Form"}</span>
          </Button>
        </div>
      </div>

      {/* Settings Form Panel */}
      {isSettingsOpen && (
        <div className="bg-white rounded-2xl shadow-2xs border border-primary/20 p-4 sm:p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">Konfigurasi Pendaftaran Online</h3>
            {savedFeedback && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Tersimpan!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="pr-3">
                  <Label className="text-sm sm:text-base font-semibold text-slate-900 block">Status Pendaftaran Online</Label>
                  <p className="text-xs text-slate-500 mt-0.5">Buka atau tutup akses formulir pendaftaran di website publik.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setTempSettings({...tempSettings, isOpen: !tempSettings.isOpen})}
                  className={`relative flex items-center w-12 h-6.5 rounded-full transition-colors shrink-0 p-0.5 ${tempSettings.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${tempSettings.isOpen ? 'translate-x-5.5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Kuota Maksimal Harian</Label>
                <Input 
                  type="number" 
                  className="h-10 rounded-xl"
                  value={tempSettings.maxDailyQuota} 
                  onChange={(e) => setTempSettings({...tempSettings, maxDailyQuota: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Pesan Pengumuman / Catatan di Form</Label>
                <textarea 
                  className="flex w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 custom-scrollbar"
                  rows={3}
                  value={tempSettings.noticeMessage}
                  onChange={(e) => setTempSettings({...tempSettings, noticeMessage: e.target.value})}
                  placeholder="Misal: Harap hadir 30 menit sebelum jadwal dokter..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2.5 pt-1">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="rounded-xl">Batal</Button>
                <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 rounded-xl font-semibold">Simpan Pengaturan</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari pasien, antrean, dokter..." 
              className="pl-9 h-9.5 bg-white text-sm rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500">
            Total <strong>{filteredAppointments.length}</strong> pendaftaran
          </div>
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 text-base mb-1">Belum Ada Antrean Pendaftaran</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? `Tidak ditemukan pendaftaran dengan kriteria pencarian "${search}".` : "Pasien yang mendaftar melalui website publik akan otomatis tercatat di sini."}
            </p>
          </div>
        )}

        {/* Mobile View: Responsive Card List */}
        {filteredAppointments.length > 0 && (
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold mb-1">
                      {apt.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{apt.patientName}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">{apt.doctorName || apt.doctorId}</span>
                    </p>
                  </div>
                  <Badge 
                    variant={apt.status === 'Selesai' ? 'default' : apt.status === 'Batal' ? 'destructive' : apt.status === 'Dikonfirmasi' ? 'outline' : 'secondary'} 
                    className="shrink-0 text-[10px]"
                  >
                    {apt.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}</span>
                    {apt.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}</span>}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2.5 text-xs rounded-lg border-slate-200 text-primary"
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    Detail
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop View: Structured Table */}
        {filteredAppointments.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Antrean</TableHead>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>Dokter / Layanan</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-mono font-bold text-slate-900">{apt.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-slate-800">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-400">{apt.phone} • {apt.paymentMethod.toUpperCase()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-xs font-medium text-slate-800">{apt.doctorName || apt.doctorId}</div>
                        <div className="text-[11px] text-slate-500">{apt.serviceName || apt.serviceId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center gap-1 text-slate-700 font-medium"><Calendar className="w-3 h-3" /> {apt.date}</span>
                        {apt.time && <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3" /> {apt.time}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apt.status === 'Selesai' ? 'default' : apt.status === 'Batal' ? 'destructive' : apt.status === 'Dikonfirmasi' ? 'outline' : 'secondary'}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 rounded-lg text-xs"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg"
                          onClick={() => handleDelete(apt.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title={`Detail Pendaftaran (${selectedAppointment?.id})`}
        description="Informasi lengkap jadwal dan data pasien terdaftar."
        icon={<Calendar className="w-5 h-5 text-primary" />}
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Ubah Status:</span>
              <select
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:ring-primary"
                value={selectedAppointment?.status || "Menunggu"}
                onChange={(e) => selectedAppointment && handleStatusChange(selectedAppointment.id, e.target.value as Appointment["status"])}
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Dikonfirmasi">Dikonfirmasi</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
            <Button onClick={() => setSelectedAppointment(null)} className="rounded-xl w-full sm:w-auto">
              Tutup
            </Button>
          </div>
        }
      >
        {selectedAppointment && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-xs text-slate-500 block">Nama Pasien</span>
                <span className="font-bold text-slate-900">{selectedAppointment.patientName}</span>
                <span className="text-[11px] text-slate-500 block">Tipe: Pasien {selectedAppointment.patientType === "baru" ? "Baru" : "Lama"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">No. Kontak WhatsApp / HP</span>
                <span className="font-medium text-slate-800">{selectedAppointment.phone}</span>
                <span className="text-[11px] text-slate-500 block">Metode Bayar: {selectedAppointment.paymentMethod.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Layanan & Dokter</span>
                <span className="font-semibold text-primary block">{selectedAppointment.doctorName || selectedAppointment.doctorId}</span>
                <span className="text-xs text-slate-600">{selectedAppointment.serviceName || selectedAppointment.serviceId}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Waktu Reservasi</span>
                <span className="font-medium text-slate-800">{selectedAppointment.date} {selectedAppointment.time ? `— Jam ${selectedAppointment.time}` : ''}</span>
                <span className="text-[11px] text-slate-400 block">Didaftarkan: {selectedAppointment.createdAt}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-1">Catatan / Keluhan Pasien:</span>
              <p className="text-slate-700 italic">"{selectedAppointment.notes || 'Tidak ada catatan tambahan.'}"</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
