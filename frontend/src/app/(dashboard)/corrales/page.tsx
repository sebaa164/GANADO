"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

interface Corral {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  capacidad_maxima: number;
  animales_count: number;
  alertas_pendientes_count: number;
}

export default function CorralesPage() {
  const [corrales, setCorrales] = useState<Corral[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    api.get("/corrales").then((res) => setCorrales(res.data)).catch(() => addToast("error", "Error al cargar corrales.")).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Corrales</h1>
          <p className="text-sm text-gray-500 mt-1">{corrales.length} {corrales.length === 1 ? "corral registrado" : "corrales registrados"}</p>
        </div>
        <Link href="/corrales/nuevo" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-dark text-white text-sm font-semibold no-underline transition-all hover:bg-[#224f22] active:scale-[0.98] shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Nuevo corral
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-card">
              <div className="skeleton h-5 w-32 mb-3" />
              <div className="skeleton h-3 w-24 mb-4" />
              <div className="skeleton h-2 w-full mb-4" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>
      ) : corrales.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {corrales.map((c) => {
            const max = c.capacidad_maxima > 0 ? c.capacidad_maxima : 1;
            const actual = c.animales_count;
            const pct = Math.min(100, Math.round((actual / max) * 100));
            const barColor = pct >= 90 ? "#C94A3F" : pct >= 70 ? "#BA7517" : "#639922";

            return (
              <div key={c.id} className="group bg-white border border-gray-200/70 rounded-2xl p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#eef6ee] text-green-dark flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-bold text-gray-900 truncate">{c.descripcion || `Corral #${c.id}`}</div>
                      <div className="text-xs text-gray-400">C&oacute;digo: {c.codigo}</div>
                    </div>
                  </div>
                  {c.alertas_pendientes_count > 0 ? (
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-primary">
                      {c.alertas_pendientes_count} alertas
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-green-dark">
                      Sin alertas
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-500">Ocupaci&oacute;n</span>
                    <span className="text-xs font-semibold" style={{ color: barColor }}>
                      {actual} / {c.capacidad_maxima} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-gray-50/80 rounded-xl p-3">
                    <div className="text-[11px] text-gray-400 mb-0.5">Animales</div>
                    <div className="text-lg font-bold text-green-dark">{actual}</div>
                  </div>
                  <div className="bg-gray-50/80 rounded-xl p-3">
                    <div className="text-[11px] text-gray-400 mb-0.5">Disponibles</div>
                    <div className="text-lg font-bold" style={{ color: Math.max(0, max - actual) > 0 ? "#6b7280" : "#C94A3F" }}>
                      {Math.max(0, (c.capacidad_maxima || 0) - actual)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <Link href={`/corrales/${c.id}`} className="text-sm text-green-dark font-medium no-underline hover:text-green-base transition-colors">Ver detalle &rarr;</Link>
                  <Link href={`/corrales/${c.id}/editar`} className="text-sm text-gray-400 no-underline hover:text-gray-600 transition-colors">Editar</Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No hay corrales registrados a&uacute;n.</p>
          <Link href="/corrales/nuevo" className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-green-dark text-white text-sm font-semibold no-underline transition-all hover:bg-[#224f22]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Crear primer corral
          </Link>
        </div>
      )}
    </div>
  );
}
