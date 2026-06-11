"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

interface Alerta {
  id: number;
  tipo_anomalia: string;
  descripcion: string | null;
  prioridad: string;
  estado: string;
  generada_en: string;
  animal: { codigo_caravana: string } | null;
  corral: { descripcion: string } | null;
}

const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
  alta: { bg: "#fef2f2", text: "#C94A3F", dot: "#C94A3F" },
  media: { bg: "#fffbeb", text: "#BA7517", dot: "#BA7517" },
  baja: { bg: "#f0fdf4", text: "#3B6D11", dot: "#639922" },
};

const priorityLabels: Record<string, string> = {
  alta: "Cr&iacute;tica",
  media: "Advertencia",
  baja: "Normal",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, lastPage: 1 });
  const [severidad, setSeveridad] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  function fetchAlertas(page = 1) {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (severidad) params.severidad = severidad;
    if (estado) params.estado = estado;
    if (tipo) params.tipo = tipo;
    api.get("/alertas", { params }).then((res) => {
      setAlertas(res.data.alertas);
      setTipos(res.data.tiposDisponibles);
      setMeta(res.data.meta);
    }).catch(() => addToast("error", "Error al cargar alertas.")).finally(() => setLoading(false));
  }

  useEffect(() => { fetchAlertas(); }, []);

  async function resolver(id: number) {
    try {
      await api.put(`/alertas/${id}/resolver`);
      addToast("success", "Alerta resuelta correctamente.");
      fetchAlertas(meta.currentPage);
    } catch {
      addToast("error", "Error al resolver la alerta.");
    }
  }

  const hasFilters = severidad || estado !== "pendiente" || tipo;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alertas</h1>
          <p className="text-sm text-gray-500 mt-1">{meta.total} {meta.total === 1 ? "alerta registrada" : "alertas registradas"}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-2xl p-4 shadow-card mb-5">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Severidad</span>
            <select value={severidad} onChange={(e) => setSeveridad(e.target.value)}
              className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]">
              <option value="">Todas</option>
              <option value="alta">Cr&iacute;tica</option>
              <option value="media">Advertencia</option>
              <option value="baja">Normal</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</span>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}
              className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]">
              <option value="pendiente">Pendientes</option>
              <option value="resuelta">Resueltas</option>
              <option value="todas">Todas</option>
            </select>
          </div>
          {tipos.length > 0 && (
            <div className="flex flex-col gap-1 min-w-[130px]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]">
                <option value="">Todos</option>
                {tipos.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
          )}
          {hasFilters && (
            <button onClick={() => { setSeveridad(""); setEstado("pendiente"); setTipo(""); fetchAlertas(); }}
              className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 font-medium cursor-pointer font-sans transition-all hover:bg-gray-50">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-12 w-full" />)}
          </div>
        ) : alertas.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Animal</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Corral</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Severidad</th>
                    <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Generada</th>
                    <th className="px-4 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {alertas.map((a) => {
                    const pc = priorityConfig[a.prioridad] || priorityConfig.baja;
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: pc.bg, color: pc.text }}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none">
                                {a.prioridad === "alta" ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                ) : a.prioridad === "media" ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900">{a.tipo_anomalia}</div>
                              {a.descripcion && <div className="text-xs text-gray-400 truncate max-w-[200px]">{a.descripcion}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{a.animal?.codigo_caravana || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600 font-medium">
                            {a.corral?.descripcion || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: pc.bg, color: pc.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: pc.dot }} />
                            {priorityLabels[a.prioridad] || a.prioridad}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            a.estado === "pendiente" ? "bg-[#fffbeb] text-[#BA7517]" : "bg-[#f0fdf4] text-green-dark"
                          }`}>
                            {a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{timeAgo(a.generada_en)}</td>
                        <td className="px-4 py-3 text-right">
                          {a.estado === "pendiente" && (
                            <button onClick={() => resolver(a.id)}
                              className="px-3 py-1.5 rounded-lg bg-green-dark/8 text-green-dark border border-green-dark/20 text-xs font-semibold cursor-pointer font-sans transition-all hover:bg-green-dark hover:text-white">
                              Resolver
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {meta.lastPage > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm">
                <span className="text-gray-400">
                  Mostrando {(meta.currentPage - 1) * 20 + 1}&ndash;{Math.min(meta.currentPage * 20, meta.total)} de {meta.total}
                </span>
                <div className="flex gap-2">
                  <button disabled={meta.currentPage <= 1} onClick={() => fetchAlertas(meta.currentPage - 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default">
                    Anterior
                  </button>
                  <button disabled={meta.currentPage >= meta.lastPage} onClick={() => fetchAlertas(meta.currentPage + 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
              <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-500">
              {hasFilters ? "No hay alertas que coincidan con los filtros." : "No hay alertas registradas. &iexcl;Todo en orden!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
