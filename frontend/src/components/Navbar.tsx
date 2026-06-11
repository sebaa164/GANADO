"use client";

import { useAuth } from "@/contexts/AuthContext";
import { initialLetter } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-5 z-[100]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border-none bg-gray-100 cursor-pointer text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Toggle menu"
        >
          <svg fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <a href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="w-[34px] h-[34px] rounded-xl bg-green-dark flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-white fill-none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight">GanadoVision</span>
        </a>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
        >
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-semibold text-gray-900 leading-tight">{user?.name || "Usuario"}</div>
            <div className="text-[11px] text-green-dark font-medium">Administrador</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-dark text-white text-[13px] font-bold flex items-center justify-center shrink-0 shadow-sm">
            {initialLetter(user?.name || "U")}
          </div>
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {userMenuOpen && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-[220px] bg-white border border-gray-200/80 rounded-xl shadow-lg overflow-hidden z-50 animate-fadeIn origin-top-right">
            <div className="p-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="text-[13px] font-semibold text-gray-900">{user?.name || "Usuario"}</div>
              <div className="text-[11px] text-green-dark mt-0.5 font-medium">Administrador</div>
            </div>
            <div className="py-1">
              <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-gray-600 bg-none border-none cursor-pointer font-sans transition-colors hover:bg-gray-50">
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Mi perfil
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-red-600 bg-none border-none cursor-pointer font-sans transition-colors hover:bg-red-50"
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Cerrar sesi&oacute;n
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
