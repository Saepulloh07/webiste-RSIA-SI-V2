import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeRole, AdminRole } from "@/app/api";

interface RoleGuardProps {
  allowedRoles: (AdminRole | string)[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const currentRole = normalizeRole(localStorage.getItem("adminRole"));
  const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));

  if (normalizedAllowed.includes(currentRole)) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
        <Lock className="w-3 h-3 text-slate-500" />
        <span>Akses Terbatas — Error 403</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mb-2">
        Hak Akses Tidak Mencukupi
      </h2>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Halaman ini memerlukan hak akses <strong className="text-slate-800 font-semibold">{allowedRoles.join(" atau ")}</strong>. Akun Anda saat ini memiliki role <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">{currentRole}</span>.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button asChild className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold">
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
