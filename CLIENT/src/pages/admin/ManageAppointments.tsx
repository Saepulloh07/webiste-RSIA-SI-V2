import { useState } from "react";
import { Settings, CheckCircle2, Clock, Calendar, XCircle, Search, User, Stethoscope, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

const mockAppointments = [
  { id: "AP-001", patientName: "Ny. Ratna", phone: "081234567890", doctor: "Dr. Amanda Saraswati, Sp.OG", date: "15 Okt 2024", time: "09:00", status: "Menunggu", notes: "Kontrol kehamilan trimester 3" },
  { id: "AP-002", patientName: "An. Budi (Ibu Siti)", phone: "081298765432", doctor: "Dr. Budi Santoso, Sp.A", date: "15 Okt 2024", time: "14:30", status: "Selesai", notes: "Imunisasi DPT lanjutan" },
  { id: "AP-003", patientName: "Ny. Linda", phone: "082155566677", doctor: "Dr. Citra Lestari, Sp.OG(K)", date: "16 Okt 2024", time: "10:00", status: "Batal", notes: "Jadwal ulang ke minggu depan" },
];

export default function ManageAppointments() {
  const { registrationSettings, setRegistrationSettings } = useStore();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(registrationSettings);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const handleSaveSettings = () => {
    setRegistrationSettings(tempSettings);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const filteredAppointments = appointments.filter(
    (apt) => 
      apt.patientName.toLowerCase().includes(search.toLowerCase()) || 
      apt.doctor.toLowerCase().includes(search.toLowerCase()) ||
      apt.id.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Mobile View: Responsive Card List */}
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
                    <span className="truncate">{apt.doctor}</span>
                  </p>
                </div>
                <Badge variant={apt.status === 'Selesai' ? 'default' : apt.status === 'Batal' ? 'destructive' : 'secondary'} className="shrink-0 text-[10px]">
                  {apt.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}</span>
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

        {/* Desktop View: Structured Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Antrean</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Dokter Tujuan</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono font-bold text-slate-900">{apt.id}</TableCell>
                  <TableCell className="font-semibold text-slate-800">{apt.patientName}</TableCell>
                  <TableCell>{apt.doctor}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="flex items-center gap-1 text-slate-700 font-medium"><Calendar className="w-3 h-3" /> {apt.date}</span>
                      <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3" /> {apt.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apt.status === 'Selesai' ? 'default' : apt.status === 'Batal' ? 'destructive' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 rounded-lg text-xs"
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
          <Button onClick={() => setSelectedAppointment(null)} className="rounded-xl w-full sm:w-auto">
            Tutup
          </Button>
        }
      >
        {selectedAppointment && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-xs text-slate-500 block">Nama Pasien</span>
                <span className="font-bold text-slate-900">{selectedAppointment.patientName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">No. Kontak WhatsApp</span>
                <span className="font-medium text-slate-800">{selectedAppointment.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Dokter Spesialis</span>
                <span className="font-semibold text-primary">{selectedAppointment.doctor}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Waktu Reservasi</span>
                <span className="font-medium text-slate-800">{selectedAppointment.date} — Jam {selectedAppointment.time}</span>
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
