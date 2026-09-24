import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, Activity, FileText, CalendarDays, ArrowRight, Sparkles,
  Megaphone, Briefcase, Images, UserCog, Settings, ShieldCheck
} from "lucide-react";
import { useStore } from "@/store";
import { api, normalizeRole } from "@/app/api";

export default function Dashboard() {
  const {
    doctors, services, articles, appointments, ads, vacancies, media, users,
    fetchAppointments, fetchDoctors, fetchServices, fetchArticles,
    fetchAds, fetchVacancies, fetchMedia, fetchUsers
  } = useStore();

  const role = normalizeRole(localStorage.getItem("adminRole"));
  const isSuperAdmin = role === "Super Admin";
  const isAdmin = role === "Admin";
  const isEditor = role === "Editor";

  let userName = "Administrator";
  try {
    const raw = localStorage.getItem("adminUser");
    if (raw) {
      const u = JSON.parse(raw);
      if (u.name) userName = u.name;
    }
  } catch {}

  const [stats, setStats] = useState<{
    totalDoctors: number;
    totalServices: number;
    totalArticles: number;
    totalAppointmentsToday: number;
    recentAppointments: Array<{
      id: string;
      patientName: string;
      doctorName: string;
      date: string;
      status: string;
    }>;
  }>({
    totalDoctors: doctors?.length ?? 0,
    totalServices: services?.length ?? 0,
    totalArticles: articles?.length ?? 0,
    totalAppointmentsToday: appointments?.length ?? 0,
    recentAppointments: [],
  });

  useEffect(() => {
    // 1. Fetch live metrics from Backend API
    const loadStats = async () => {
      try {
        const res = await api.dashboard.getStats();
        if (res?.data) {
          setStats({
            totalDoctors: res.data.totalDoctors ?? doctors.length,
            totalServices: res.data.totalServices ?? services.length,
            totalArticles: res.data.totalArticles ?? articles.length,
            totalAppointmentsToday: res.data.totalAppointmentsToday ?? appointments.length,
            recentAppointments: res.data.recentAppointments || [],
          });
        }
      } catch (err) {
        console.warn("Failed to load dashboard stats from backend API; using local store cache.", err);
      }
    };

    loadStats();
    fetchArticles(true);
    fetchAds();
    fetchVacancies(true);
    fetchMedia();

    if (!isEditor) {
      fetchAppointments();
      fetchDoctors();
      fetchServices();
    }

    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [fetchAppointments, fetchDoctors, fetchServices, fetchArticles, fetchAds, fetchVacancies, fetchMedia, fetchUsers, isEditor, isSuperAdmin]);

  const displayTotalDoctors = stats.totalDoctors || (doctors?.length ?? 0);
  const displayTotalServices = stats.totalServices || (services?.length ?? 0);
  const displayTotalArticles = stats.totalArticles || (articles?.length ?? 0);
  const displayTotalAppointments = stats.totalAppointmentsToday || (appointments?.length ?? 0);
  const displayTotalAds = (ads || []).filter((a) => a.status === "Aktif").length;
  const displayTotalVacancies = (vacancies || []).length;
  const displayTotalMedia = (media || []).length;
  const displayTotalUsers = (users || []).length;

  const displayRecentAppointments =
    stats.recentAppointments && stats.recentAppointments.length > 0
      ? stats.recentAppointments
      : appointments.slice(0, 4).map((a) => ({
          id: a.id,
          patientName: a.patientName,
          doctorName: a.doctorName || a.doctorId,
          date: a.date,
          status: a.status,
        }));

  const recentArticles = (articles || []).slice(0, 4);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary/90 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isSuperAdmin
                ? "Hak Akses Penuh — Super Admin"
                : isAdmin
                ? "Hak Akses — Admin Operasional"
                : "Hak Akses — Editor Konten & Media"}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-heading text-white">
            Selamat Datang, {userName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {isEditor
              ? "Kelola konten artikel kesehatan, materi promosi & iklan landing page, lowongan karir, serta aset media rumah sakit."
              : isSuperAdmin
              ? "Kelola seluruh sistem RSIA Sayang Ibu: akun pengguna CMS, profil rumah sakit, pendaftaran pasien, dokter, dan publikasi."
              : "Kelola data dokter, jadwal praktik, pendaftaran antrean online pasien, dan publikasi informasi operasional rumah sakit."}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 border border-white/20 text-white">
            Role: {role}
          </span>
        </div>
      </div>

      {/* Metric Cards - customized per role */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {isEditor ? (
          <>
            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Artikel & Berita</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalArticles}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Konten edukasi medis</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Promo Aktif</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalAds}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Kampanye landing page</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Lowongan Karir</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalVacancies}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Posisi terpublikasi</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Media Library</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Images className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalMedia}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Foto & aset visual</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Total Dokter</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalDoctors}</div>
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
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{displayTotalServices}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Poliklinik & fasilitas</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">Pendaftaran Pasien</CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-primary">{displayTotalAppointments}</div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Antrean online hari ini</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
              <CardHeader className="p-3.5 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
                  {isSuperAdmin ? "Pengguna CMS" : "Artikel & Berita"}
                </CardTitle>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  {isSuperAdmin ? <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  {isSuperAdmin ? (displayTotalUsers || 1) : displayTotalArticles}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  {isSuperAdmin ? "Staf administrator aktif" : "Edukasi kesehatan medis"}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Navigation based on role */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
          Akses Cepat Pengelolaan ({role})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {isEditor ? (
            <>
              <Link
                to="/admin/articles"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Tulis Artikel</span>
              </Link>
              <Link
                to="/admin/ads"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Megaphone className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">Kelola Promo</span>
              </Link>
              <Link
                to="/admin/media"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Images className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Media Library</span>
              </Link>
              <Link
                to="/admin/vacancies"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Lowongan Karir</span>
              </Link>
            </>
          ) : isSuperAdmin ? (
            <>
              <Link
                to="/admin/users"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <UserCog className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Pengguna CMS</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Settings className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Pengaturan Web</span>
              </Link>
              <Link
                to="/admin/appointments"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">Pendaftaran Pasien</span>
              </Link>
              <Link
                to="/admin/doctors"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Kelola Dokter</span>
              </Link>
            </>
          ) : (
            <>
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
                to="/admin/services"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Layanan Medis</span>
              </Link>
              <Link
                to="/admin/articles"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 hover:border-primary/40 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:text-primary"
              >
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Artikel & Berita</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {isEditor ? (
          <Card className="lg:col-span-2 rounded-2xl border-slate-200/80 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-heading">Artikel & Publikasi Konten Terbaru</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Daftar artikel edukasi dan berita yang baru diperbarui.</p>
              </div>
              <Link to="/admin/articles" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                <span>Kelola Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {recentArticles && recentArticles.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentArticles.map((art) => (
                    <div key={art.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{art.title}</div>
                        <div className="text-slate-500 text-[11px] truncate">
                          {art.category} • {art.date}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          art.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-xl">
                  Belum ada artikel yang dipublikasikan.
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
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
              {displayRecentAppointments && displayRecentAppointments.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {displayRecentAppointments.map((apt) => (
                    <div key={apt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{apt.patientName}</div>
                        <div className="text-slate-500 text-[11px] truncate">
                          {apt.doctorName} • {apt.date}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          apt.status === "Dikonfirmasi" || apt.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700"
                            : apt.status === "Batal"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
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
        )}

        <Card className="rounded-2xl border-slate-200/80 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold font-heading">Status Akses & Sistem</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Kredensial aktif dan info integrasi.</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Peran Akun</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                {role}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Status REST API</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Terhubung (Port 5000)
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Versi Portal</span>
              <span className="font-semibold text-slate-800">v2.0 (NestJS + React)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Lingkup Hak</span>
              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[150px]">
                {isSuperAdmin ? "Seluruh Modul & Konfigurasi" : isAdmin ? "Layanan, Dokter & Antrean" : "Konten, Media & Artikel"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mode Sistem</span>
              <span className="font-semibold text-primary">Live Full-Stack Integration</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
