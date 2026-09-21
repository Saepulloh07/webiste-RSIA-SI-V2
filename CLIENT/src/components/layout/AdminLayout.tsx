import { useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";

export function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  const role = localStorage.getItem("adminRole") || "Editor";

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const roleColor =
    role === "Super Admin"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : role === "Admin"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="h-screen flex bg-slate-100/90 font-sans text-slate-900 overflow-hidden">
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Responsive Admin Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-10 shadow-2xs">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile / Tablet */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden h-10 w-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Mobile Header Title */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="lg:hidden w-7 h-9 rounded-full bg-white p-0.5 border border-amber-300 shrink-0 overflow-hidden shadow-2xs">
                <img
                  src="/logo-sayang-ibu-sm.png"
                  alt="Logo RSIA"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-heading font-bold text-sm sm:text-base lg:text-lg text-slate-900 leading-tight truncate">
                  <span className="hidden sm:inline">RSIA Sayang Ibu — </span>
                  <span>Panel Admin</span>
                </h1>
                <p className="hidden md:block text-[11px] text-slate-400 leading-none mt-0.5">
                  Batusangkar, Tanah Datar, Sumatera Barat
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{role}</span>
            </div>

            {/* View Website External Link */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 px-2.5 sm:px-3 text-xs gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:text-primary hover:border-primary/40 bg-white shadow-2xs"
            >
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline font-medium">Lihat Website</span>
              </Link>
            </Button>

            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {role.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Main View Area with Responsive Padding */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/70">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

