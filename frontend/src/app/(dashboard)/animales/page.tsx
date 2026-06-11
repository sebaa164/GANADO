"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

interface Animal {
  id: number;
  codigo_caravana: string;
  raza: string | null;
  sexo: string;
  fecha_ingreso: string;
  peso_ingreso_kg: number | null;
  activo: boolean;
  corral: { id: number; descripcion: string } | null;
}

interface CorralOption {
  id: number; descripcion: string;
}

export default function AnimalesPage() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [corrales, setCorrales] = useState<CorralOption[]>([]);
  const [razas, setRazas] = useState<string[]>([]);
  const [meta, setMeta] = useState({ total: 0, from: 0, to: 0, currentPage: 1, lastPage: 1 });
  const [busqueda, setBusqueda] = useState("");
  const [corralFiltro, setCorralFiltro] = useState("");
  const [razaFiltro, setRazaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("activos");
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  function fetchAnimales(page = 1) {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (busqueda) params.busqueda = busqueda;
    if (corralFiltro) params.corral = corralFiltro;
    if (razaFiltro) params.raza = razaFiltro;
    if (estadoFiltro) params.estado = estadoFiltro;
    api.get("/animales", { params }).then((res) => {
      setAnimales(res.data.animales);
      setCorrales(res.data.corralesDisponibles);
      setRazas(res.data.razasDisponibles);
      setMeta(res.data.meta);
    }).catch(() => addToast("error", "Error al cargar animales.")).finally(() => setLoading(false));
  }

  useEffect(() => { fetchAnimales(); }, []);

  const hasFilters = busqueda || corralFiltro || razaFiltro || estadoFiltro !== "activos";

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Animales</h1>
          <p className="text-sm text-gray-500 mt-1">{meta.total} {meta.total === 1 ? "animal registrado" : "animales registrados"}</p>
        </div>
        <Link href="/animales/nuevo" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-dark text-white text-sm font-semibold no-underline transition-all hover:bg-[#224f22] active:scale-[0.98] shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Registrar animal
        </Link>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-2xl p-4 shadow-card mb-5">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Buscar</span>
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Caravana o raza..." onKeyDown={(e) => e.key === "Enter" && fetchAnimales()}
              className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)] placeholder:text-gray-300" />
          </div>
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</span>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]">
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="todos">Todos</option>
            </select>
          </div>
          {corrales.length > 0 && (
            <div className="flex flex-col gap-1 min-w-[130px]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Corral</span>
              <select value={corralFiltro} onChange={(e) => setCorralFiltro(e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-sans outline-none transition-all focus:border-green-dark/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]">
                <option value="">Todos</option>
                {corrales.map((c) => (<option key={c.id} value={c.id}>{c.descripcion}</option>))}
              </select>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button onClick={() => fetchAnimales()} className="h-9 px-4 rounded-lg bg-green-dark text-white text-sm font-semibold border-none cursor-pointer font-sans transition-all hover:bg-[#224f22] active:scale-[0.98]">
              Buscar
            </button>
            {hasFilters && (
              <button onClick={() => { setBusqueda(""); setCorralFiltro(""); setRazaFiltro(""); setEstadoFiltro("activos"); fetchAnimales(); }}
                className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 font-medium cursor-pointer font-sans transition-all hover:bg-gray-50">
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-12 w-full" />)}
          </div>
        ) : animales.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Animal</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Raza</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sexo</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Corral</th>
                    <th className="px-4 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Peso ingreso</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fecha ingreso</th>
                    <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {animales.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-green-dark/8 text-green-dark text-xs font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {a.codigo_caravana.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{a.codigo_caravana}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.raza || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          a.sexo === "macho" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                        }`}>
                          {a.sexo.charAt(0).toUpperCase() + a.sexo.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600 font-medium">
                          {a.corral?.descripcion || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-green-dark">{a.peso_ingreso_kg ? `${a.peso_ingreso_kg.toFixed(1)} kg` : "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{formatDate(a.fecha_ingreso)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          a.activo ? "bg-green-50 text-green-dark" : "bg-gray-100 text-gray-500"
                        }`}>
                          {a.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/animales/${a.id}`} className="text-[13px] text-green-dark font-medium no-underline hover:text-green-base transition-colors opacity-0 group-hover:opacity-100">
                          Ver &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta.lastPage > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm">
                <span className="text-gray-400">
                  Mostrando {meta.from}&ndash;{meta.to} de {meta.total}
                </span>
                <div className="flex gap-2">
                  <button disabled={meta.currentPage <= 1} onClick={() => fetchAnimales(meta.currentPage - 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default">
                    Anterior
                  </button>
                  <button disabled={meta.currentPage >= meta.lastPage} onClick={() => fetchAnimales(meta.currentPage + 1)}
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
              <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-500">{hasFilters ? "No hay animales que coincidan con los filtros." : "No hay animales registrados a&uacute;n."}</p>
            {!hasFilters && (
              <Link href="/animales/nuevo" className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-green-dark text-white text-sm font-semibold no-underline transition-all hover:bg-[#224f22]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                Registrar primer animal
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
