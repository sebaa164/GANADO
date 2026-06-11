"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";

const icons: Record<string, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-white fill-none shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-white fill-none shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-white fill-none shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
};

const styles: Record<string, string> = {
  success: "bg-green-dark",
  error: "bg-primary",
  info: "bg-green-medium",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-[9999] flex flex-col gap-2.5 max-w-[380px] w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-elevated text-white text-sm font-medium ${styles[toast.type]} ${toast.leaving ? "animate-toastOut" : "animate-toastIn"}`}
        >
          {icons[toast.type]}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="bg-none border-none text-white/70 cursor-pointer p-0.5 hover:text-white transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
