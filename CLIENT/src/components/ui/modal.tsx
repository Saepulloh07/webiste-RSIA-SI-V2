import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
  "3xl": "max-w-4xl",
  "4xl": "max-w-5xl",
  "5xl": "max-w-6xl",
};

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon,
  children, 
  footer,
  size = "2xl", 
  className 
}: ModalProps) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content Dialog */}
      <div 
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full flex flex-col my-auto border border-slate-100 max-h-[94vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 z-10 overflow-hidden",
          sizeClasses[size] || "max-w-3xl",
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-rose-50/30 shrink-0">
            <div className="flex items-start gap-2.5 sm:gap-3.5 pr-2 sm:pr-4 min-w-0">
              {icon && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 shadow-xs [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h2 className="font-heading font-bold text-base sm:text-xl text-slate-900 tracking-tight leading-snug truncate sm:whitespace-normal">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 -mr-1"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {!title && !description && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors z-20"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 custom-scrollbar space-y-4 sm:space-y-5 bg-white overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/80 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 sm:gap-3 shrink-0 [&>button]:w-full sm:[&>button]:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

