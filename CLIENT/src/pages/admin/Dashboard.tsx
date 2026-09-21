import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Users, Activity, FileText, CalendarDays, PlusCircle, ArrowRight, ShieldAlert, Clock, Sparkles } from "lucide-react";
import { useStore } from "@/store";

export default function Dashboard() {
  const { doctors, services, articles, ads, appointments } = useStore();
  const role = localStorage.getItem("adminRole") || "Editor";

  const totalDoctors = doctors?.length || 24;
  const totalServices = services?.length || 12;
  const totalArticles = articles?.length || 45;
  const totalAppointments = appointments?.length || 18;

  return (
    <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary/90 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Manajemen RSIA Sayang Ibu</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-heading text-white">
            Selamat Datang, {role}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Kelola data dokter, jadwal praktik, pendaftaran pasien, serta konten publikasi rumah sakit dengan mudah dari smartphone maupun desktop.
          </p>
        </div>
      </div>

      {/* Metric Cards - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Total Dokter</CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{totalDoctors}</div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Dokter spesialis & umum</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Total Layanan</CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{totalServices}</div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Poliklinik & IGD 24 Jam</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Artikel & Berita</CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{totalArticles}</div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Edukasi kesehatan ibu & anak</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Pendaftaran Hari Ini</CardTitle>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-primary">{totalAppointments}</div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Antrean online aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation on Mobile */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
          Akses Cepat Pengelolaan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <Link 
            to="/admin/doctors" 
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
          >
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Kelola Dokter</span>
          </Link>
          <Link 
            to="/admin/appointments" 
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
          >
            <CalendarDays className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Pendaftaran Pasien</span>
          </Link>
          <Link 
            to="/admin/articles" 
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
          >
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">Artikel & Berita</span>
          </Link>
          <Link 
            to="/admin/ads" 
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
          >
            <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Promo & Layanan</span>
          </Link>
        </div>
      </div>

      {/* Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-slate-200/80 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold font-heading">Antrean Pendaftaran Terbaru</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Pasien yang terdaftar melalui formulir online.</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {appointments && appointments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{apt.patientName}</div>
                      <div className="text-slate-500 text-[11px] truncate">{apt.doctorName || apt.doctorId} • {apt.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 shrink-0">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-xl">
                Belum ada pendaftaran online hari ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold font-heading">Status Sistem CMS</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Informasi koneksi dan lisensi.</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Status Server</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operasional
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Versi Portal</span>
              <span className="font-semibold text-slate-800">v2.4 (Mobile-Ready)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Rumah Sakit</span>
              <span className="font-semibold text-slate-800 truncate max-w-[140px]">RSIA Sayang Ibu</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mode Tampilan</span>
              <span className="font-semibold text-primary">Responsive Adaptive</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

