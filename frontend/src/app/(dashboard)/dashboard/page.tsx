"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

interface DashboardData {
  totalAnimales: number;
  alertasPendientes: number;
  pesoPromedio: number | null;
  temperatura: number | null;
  alertasRecientes: Array<{
    id: number;
    tipo_anomalia: string;
    descripcion: string;
    prioridad: string;
    animal: { codigo_caravana: string } | null;
    corral: { descripcion: string } | null;
  }>;
  ultimosAnimales: Array<{
    id: number;
    codigo_caravana: string;
    raza: string | null;
    fecha_ingreso: string;
    peso_ingreso_kg: number | null;
    corral: { descripcion: string } | null;
  }>;
  corrales: Array<{
    id: number;
    descripcion: string;
    capacidad_maxima: number;
    animales_count: number;
  }>;
}

function CountUp({ target, decimals = 0, duration = 1000 }: { target: number; decimals?: number; duration?: number }) {
  const [display, setDisplay] = useState(decimals > 0 ? "0.0" : "0");

  useEffect(() => {
    if (target === 0) {
      setDisplay(decimals > 0 ? "0.0" : "0");
      return;
    }
    const startTime = performance.now();
    let frame: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString());
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, decimals, duration]);

  return <>{display}</>;
}

const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
  alta: { bg: "#fef2f2", text: "#C94A3F", dot: "#C94A3F" },
  media: { bg: "#fffbeb", text: "#BA7517", dot: "#BA7517" },
  baja: { bg: "#f0fdf4", text: "#3B6D11", dot: "#639922" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch(() => addToast("error", "Error al cargar el dashboard.")).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="skeleton h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200/70 rounded-2xl p-5">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-20" />
              <div className="skeleton h-3 w-32 mt-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200/70 rounded-2xl p-5 h-48">
            <div className="skeleton h-5 w-32 mb-4" />
            <div className="skeleton h-8 w-full" />
          </div>
          <div className="bg-white border border-gray-200/70 rounded-2xl p-5 h-48">
            <div className="skeleton h-5 w-32 mb-4" />
            <div className="skeleton h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const { totalAnimales, alertasPendientes, pesoPromedio, temperatura, alertasRecientes, ultimosAnimales, corrales } = data!;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen general del estado del feedlot</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-dark/8 rounded-full text-xs font-medium text-green-dark">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-green-dark/40 animate-ping" />
            <span className="block w-2 h-2 rounded-full bg-green-dark" />
          </span>
          Sistema activo
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard
          label="Peso Promedio"
          value={pesoPromedio}
          unit=" kg"
          subtitle="Promedio registrado"
          fallback="Sin pesajes"
          color="#3B6D11"
          iconBg="#f0fdf4"
          iconColor="#3B6D11"
          decimals={1}
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
        </KpiCard>

        <KpiCard
          label="Animales Activos"
          value={totalAnimales}
          subtitle="Registrados en el sistema"
          fallback="Sin animales"
          color="#3B6D11"
          iconBg="#eef6ee"
          iconColor="#2D6A2D"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </KpiCard>

        <KpiCard
          label="Alertas Activas"
          value={alertasPendientes}
          subtitle={alertasPendientes > 0 ? "Requieren atenci&oacute;n" : "Sin alertas pendientes"}
          fallback="Sin alertas"
          color={alertasPendientes > 0 ? "#C94A3F" : "#BA7517"}
          iconBg={alertasPendientes > 0 ? "#fef2f2" : "#fffbeb"}
          iconColor={alertasPendientes > 0 ? "#C94A3F" : "#BA7517"}
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </KpiCard>

        <KpiCard
          label="Temperatura Ambiente"
          value={temperatura}
          unit=" &deg;C"
          subtitle="Registro m&aacute;s reciente"
          fallback="Sin datos"
          color="#3B6D11"
          iconBg="#f5fae8"
          iconColor="#639922"
          decimals={1}
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
        </KpiCard>
      </div>

      {alertasRecientes.length > 0 && (
        <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card mb-5 overflow-hidden hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center text-primary">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">Alertas Recientes</span>
                <span className="text-xs text-gray-400 ml-2">{alertasRecientes.length} pendientes</span>
              </div>
            </div>
            <Link href="/alertas" className="text-[13px] text-green-dark font-medium no-underline hover:text-green-base transition-colors">Ver todas &rarr;</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {alertasRecientes.slice(0, 5).map((a) => {
              const pc = priorityConfig[a.prioridad] || priorityConfig.baja;
              return (
                <div key={a.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pc.dot }} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-gray-900 truncate">{a.tipo_anomalia}</div>
                      <div className="text-xs text-gray-400 truncate">{a.descripcion}</div>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ml-3" style={{ background: pc.bg, color: pc.text }}>
                    {a.prioridad.charAt(0).toUpperCase() + a.prioridad.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eef6ee] flex items-center justify-center text-green-dark">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">&Uacute;ltimos Ingresos</span>
            </div>
            <Link href="/animales" className="text-[13px] text-green-dark font-medium no-underline hover:text-green-base transition-colors">Ver todos &rarr;</Link>
          </div>
          {ultimosAnimales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Animal</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Raza</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Corral</th>
                    <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ultimosAnimales.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-green-dark/8 text-green-dark text-xs font-bold flex items-center justify-center shrink-0">
                            {a.codigo_caravana.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{a.codigo_caravana}</span>
                            <div className="text-[11px] text-gray-400">{formatDate(a.fecha_ingreso)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{a.raza || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600 font-medium">{a.corral?.descripcion || "—"}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="text-sm font-semibold text-green-dark">{a.peso_ingreso_kg ? `${a.peso_ingreso_kg.toFixed(1)} kg` : "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-14 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <p className="text-sm text-gray-400">No hay animales registrados a&uacute;n.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eef6ee] flex items-center justify-center text-green-dark">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Ocupaci&oacute;n de Corrales</span>
            </div>
            <Link href="/corrales" className="text-[13px] text-green-dark font-medium no-underline hover:text-green-base transition-colors">Ver todos &rarr;</Link>
          </div>
          {corrales.length > 0 ? (
            <div className="p-2">
              {corrales.map((c) => {
                const max = c.capacidad_maxima || 1;
                const actual = c.animales_count;
                const pct = Math.min(100, Math.round((actual / max) * 100));
                const barColor = pct >= 90 ? "#C94A3F" : pct >= 70 ? "#BA7517" : "#639922";
                return (
                  <div key={c.id} className="px-4 py-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-gray-900">{c.descripcion || `Corral #${c.id}`}</span>
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold" style={{ color: barColor }}>{actual}</span>
                        <span className="text-gray-400"> / {max}</span>
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, background: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <p className="text-sm text-gray-400">No hay corrales registrados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, unit, subtitle, fallback, color, iconBg, iconColor, decimals = 0, children,
}: {
  label: string; value: number | null; unit?: string; subtitle: string; fallback?: string;
  color: string; iconBg: string; iconColor: string; decimals?: number; children: React.ReactNode;
}) {
  return (
    <div className="group bg-white border border-gray-200/70 rounded-2xl p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: iconBg, color: iconColor }}>
          {children}
        </div>
      </div>
      {value !== null ? (
        <>
          <div className="text-[30px] font-bold leading-none mb-1.5" style={{ color }}>
            <CountUp target={value} decimals={decimals} />
            {unit && <span className="text-base font-medium opacity-70">{unit}</span>}
          </div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </>
      ) : (
        <>
          <div className="text-[30px] font-bold leading-none mb-1.5 text-gray-300">&mdash;</div>
          <div className="text-xs text-gray-400">{fallback || subtitle}</div>
        </>
      )}
    </div>
  );
}
