import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarPlus, Search, Check } from "lucide-react";
import { cn } from "@/utils/cn";

/** Header + tab navigasi yang dipakai bersama oleh halaman Daftar dan Cek Pendaftaran. */
export function RegistrationShell({
    title,
    subtitle,
    children,
    maxWidth = "max-w-6xl",
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    maxWidth?: string;
}) {
    const { pathname } = useLocation();
    const tabs = [
        { to: "/pendaftaran", label: "Daftar Online", icon: CalendarPlus, active: pathname === "/pendaftaran" },
        { to: "/pendaftaran/cek", label: "Cek Pendaftaran & Antrean", icon: Search, active: pathname.startsWith("/pendaftaran/cek") },
    ];

    return (
        <div className="bg-gradient-to-b from-rose-50/50 via-white to-white min-h-[80vh]">
            <div className={cn("container mx-auto px-4 md:px-6 py-10 md:py-14", maxWidth)}>
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-3">{title}</h1>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{subtitle}</p>
                </div>

                <nav aria-label="Menu pendaftaran" className="flex justify-center mb-8 md:mb-10">
                    <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200 max-w-full overflow-x-auto">
                        {tabs.map(({ to, label, icon: Icon, active }) => (
                            <Link
                                key={to}
                                to={to}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all",
                                    active ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </nav>

                {children}
            </div>
        </div>
    );
}

/** Stepper horizontal untuk tahapan pendaftaran. */
export function ProgressSteps({
    steps,
    current,
    failedAt,
}: {
    steps: string[];
    /** indeks tahap yang sedang berjalan */
    current: number;
    /** indeks tahap yang gagal (mis. ditolak) */
    failedAt?: number;
}) {
    return (
        <ol className="flex items-start w-full" aria-label="Tahapan pendaftaran">
            {steps.map((label, i) => {
                const failed = failedAt === i;
                const done = !failed && i < current;
                const active = !failed && i === current;
                return (
                    <li key={label} className="flex-1 flex flex-col items-center text-center relative">
                        {i > 0 && (
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "absolute top-4 right-1/2 w-full h-0.5 -z-0",
                                    i <= current && failedAt === undefined ? "bg-primary" : failedAt !== undefined && i <= failedAt ? "bg-primary" : "bg-slate-200"
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white",
                                failed && "border-rose-500 text-rose-600 bg-rose-50",
                                done && "border-primary bg-primary text-white",
                                active && "border-primary text-primary ring-4 ring-primary/15",
                                !failed && !done && !active && "border-slate-200 text-slate-400"
                            )}
                        >
                            {done ? <Check className="w-4 h-4" /> : failed ? "!" : i + 1}
                        </span>
                        <span
                            className={cn(
                                "mt-2 text-[11px] sm:text-xs leading-tight px-1 font-medium",
                                failed ? "text-rose-700" : done || active ? "text-slate-900" : "text-slate-400"
                            )}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}