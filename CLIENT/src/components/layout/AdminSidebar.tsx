import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  Settings,
  CalendarDays,
  Images,
  LogOut,
  Megaphone,
  UserCog,
  Briefcase,
  X,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const role = localStorage.getItem("adminRole") || "Editor";

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      onClick={() => onClose?.()}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150",
        isActive(to)
          ? "bg-primary text-white shadow-sm shadow-primary/20 font-semibold"
          : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0", isActive(to) ? "text-white" : "text-slate-400")} />
      <span className="truncate">{label}</span>
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  const isSuperAdmin = role === "Super Admin";
  const isAdmin = role === "Admin" || role === "Super Admin";
  const isEditor = role === "Editor" || role === "Admin" || role === "Super Admin";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-12 rounded-full bg-white p-1 border border-amber-300 flex items-center justify-center shrink-0 overflow-hidden shadow-sm aspect-square">
            <img
              src="/logo-sayang-ibu-sm.png"
              alt="Logo RSIA"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
            />
          </div>
          <div className="min-w-0">
            <span className="font-heading font-bold text-sm text-white block leading-tight truncate">RSIA Sayang Ibu</span>
            <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">Portal Admin</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />

        {isAdmin && (
          <>
            <div className="mt-5 mb-1.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hospital & Layanan</div>
            <NavItem to="/admin/doctors" icon={Users} label="Dokter & Jadwal" />
            <NavItem to="/admin/services" icon={Activity} label="Layanan Medis" />

            <div className="mt-5 mb-1.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Transaksi Pasien</div>
            <NavItem to="/admin/appointments" icon={CalendarDays} label="Pendaftaran Online" />
          </>
        )}

        {isEditor && (
          <>
            <div className="mt-5 mb-1.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Konten & Marketing</div>
            <NavItem to="/admin/articles" icon={FileText} label="Artikel & Berita" />
            <NavItem to="/admin/ads" icon={Megaphone} label="Kelola Iklan & Promo" />
            <NavItem to="/admin/media" icon={Images} label="Media Library" />
            <NavItem to="/admin/vacancies" icon={Briefcase} label="Lowongan Karir" />
          </>
        )}

        {isSuperAdmin && (
          <>
            <div className="mt-5 mb-1.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sistem & Akses</div>
            <NavItem to="/admin/users" icon={UserCog} label="Pengelola Sistem" />
            <NavItem to="/admin/settings" icon={Settings} label="Pengaturan Web" />
          </>
        )}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5 shrink-0">
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-200 block truncate">Administrator</span>
              <span className="text-[10px] text-emerald-400 font-medium">{role}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-200 flex-col flex-shrink-0 h-screen sticky top-0 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sliding Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden border-r border-slate-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar Sesi"
        description="Sesi pengelolaan website Anda akan diakhiri dengan aman."
        icon={<LogOut className="w-5 h-5 text-rose-500" />}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-5 shadow-sm">
              Ya, Keluar Akun
            </Button>
          </>
        }
      >
        <div className="py-2 text-sm text-slate-600 leading-relaxed">
          Apakah Anda yakin ingin keluar dari panel admin <strong className="text-slate-900 font-semibold">RSIA Sayang Ibu Batusangkar</strong>? Pastikan seluruh perubahan data telah disimpan sebelum keluar.
        </div>
      </Modal>
    </>
  );
}

