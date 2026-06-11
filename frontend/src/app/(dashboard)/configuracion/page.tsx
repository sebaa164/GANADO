"use client";

import { useState, useEffect, type FormEvent } from "react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

interface ConfigGroup {
  [key: string]: Array<{ clave: string; valor: string; grupo: string }>;
}

export default function ConfiguracionPage() {
  const [configs, setConfigs] = useState<ConfigGroup>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesResult, setRulesResult] = useState<any>(null);
  const [rulesError, setRulesError] = useState("");
  const { addToast } = useToast();
  const [form, setForm] = useState({
    alerta_peso_minimo_kg: "180",
    alerta_temperatura_max_c: "38",
    alerta_ocupacion_corral_pct: "90",
    nombre_establecimiento: "GanadoVision",
    notificaciones_email_activas: "0",
    notificaciones_email_destino: "",
  });

  function getVal(clave: string, def = "") {
    for (const items of Object.values(configs)) {
      for (const item of items) {
        if (item.clave === clave) return item.valor;
      }
    }
    return def;
  }

  useEffect(() => {
    api.get("/configuracion").then((res) => {
      setConfigs(res.data);
      setForm((f) => ({
        ...f,
        alerta_peso_minimo_kg: getVal("alerta_peso_minimo_kg", "180"),
        alerta_temperatura_max_c: getVal("alerta_temperatura_max_c", "38"),
        alerta_ocupacion_corral_pct: getVal("alerta_ocupacion_corral_pct", "90"),
        nombre_establecimiento: getVal("nombre_establecimiento", "GanadoVision"),
        notificaciones_email_activas: getVal("notificaciones_email_activas", "0"),
        notificaciones_email_destino: getVal("notificaciones_email_destino", ""),
      }));
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/configuracion", form);
      addToast("success", "Configuraci&oacute;n guardada correctamente.");
      setRulesResult({ message: "Configuraci&oacute;n guardada correctamente.", detalles: { peso_alertas_creadas: 0, peso_alertas_resueltas: 0, ocupacion_alertas_creadas: 0, ocupacion_alertas_resueltas: 0, clima_alertas_creadas: 0, clima_alertas_resueltas: 0 } });
    } catch {
      addToast("error", "Error al guardar la configuraci&oacute;n.");
      setRulesError("Error al guardar la configuraci&oacute;n.");
    } finally {
      setSaving(false);
    }
  }

  async function runEngine() {
    setRulesLoading(true);
    setRulesResult(null);
    setRulesError("");
    try {
      const { data } = await api.post("/configuracion/ejecutar-reglas");
      addToast("success", "Motor de reglas ejecutado correctamente.");
      setRulesResult(data);
    } catch {
      addToast("error", "Error al ejecutar el motor de reglas.");
      setRulesError("Error al ejecutar el motor de reglas.");
    } finally {
      setRulesLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center gap-3 mb-8">
          <div className="skeleton h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
          <div className="space-y-6">
            {[1,2].map(i => <div key={i} className="bg-white border border-gray-200/70 rounded-2xl p-6"><div className="skeleton h-5 w-40 mb-6" /><div className="skeleton h-10 w-full mb-3" /><div className="skeleton h-10 w-full mb-3" /><div className="skeleton h-10 w-full" /></div>)}
          </div>
          <div className="bg-white border border-gray-200/70 rounded-2xl p-6"><div className="skeleton h-5 w-40 mb-6" /><div className="skeleton h-20 w-full" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configuraci&oacute;n</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion&aacute; los par&aacute;metros del sistema, alertas y notificaciones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        <div>
          <form onSubmit={handleSave}>
            <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card p-6 mb-6">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900">L&iacute;mites de Alertas</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Peso M&iacute;nimo del Animal (kg)</label>
                  <input type="number" step="0.1" value={form.alerta_peso_minimo_kg} onChange={(e) => setForm({ ...form, alerta_peso_minimo_kg: e.target.value })}
                    className="w-full h-10 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark/40 focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]" />
                  <p className="text-xs text-gray-400 mt-1.5">Genera alerta de prioridad alta si un animal registra un peso menor a este valor.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Temperatura Ambiente M&aacute;xima (&deg;C)</label>
                  <input type="number" step="0.5" value={form.alerta_temperatura_max_c} onChange={(e) => setForm({ ...form, alerta_temperatura_max_c: e.target.value })}
                    className="w-full h-10 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark/40 focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]" />
                  <p className="text-xs text-gray-400 mt-1.5">L&iacute;mite para generar alertas de estr&eacute;s t&eacute;rmico.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Ocupaci&oacute;n M&aacute;xima de Corral (%)</label>
                  <input type="number" step="1" value={form.alerta_ocupacion_corral_pct} onChange={(e) => setForm({ ...form, alerta_ocupacion_corral_pct: e.target.value })}
                    className="w-full h-10 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark/40 focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]" />
                  <p className="text-xs text-gray-400 mt-1.5">Genera alerta de sobreocupaci&oacute;n si se supera este porcentaje.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card p-6 mb-6">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#eef6ee] flex items-center justify-center text-green-dark">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900">General y Notificaciones</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nombre del Establecimiento</label>
                  <input type="text" value={form.nombre_establecimiento} onChange={(e) => setForm({ ...form, nombre_establecimiento: e.target.value })}
                    className="w-full h-10 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark/40 focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]" />
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input type="hidden" name="notificaciones_email_activas" value="0" />
                  <input type="checkbox" id="email_activas" checked={form.notificaciones_email_activas === "1"} onChange={(e) => setForm({ ...form, notificaciones_email_activas: e.target.checked ? "1" : "0" })}
                    className="mt-0.5 w-4 h-4 accent-green-dark rounded cursor-pointer" />
                  <label htmlFor="email_activas" className="text-sm text-gray-600 cursor-pointer leading-normal">
                    <span className="font-medium">Activar notificaciones por correo</span>
                    <p className="text-xs text-gray-400 mt-0.5">Recib&iacute; alertas cr&iacute;ticas en tu correo electr&oacute;nico.</p>
                  </label>
                </div>

                {form.notificaciones_email_activas === "1" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo de destino</label>
                    <input type="email" value={form.notificaciones_email_destino} onChange={(e) => setForm({ ...form, notificaciones_email_destino: e.target.value })}
                      className="w-full h-10 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark/40 focus:shadow-[0_0_0_3px_rgba(45,106,45,0.08)]" placeholder="admin@ejemplo.com" />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-green-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer font-sans transition-all hover:bg-[#224f22] active:scale-[0.98] shadow-sm disabled:opacity-70">
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              )}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white border border-gray-200/70 rounded-2xl shadow-card p-6 sticky top-24">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-[#eef6ee] flex items-center justify-center text-green-dark">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">Motor de Reglas</h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              El motor eval&uacute;a pesos, temperatura y ocupaci&oacute;n de corrales para generar o resolver alertas autom&aacute;ticamente.
            </p>

            <div className="bg-green-dark/5 border border-dashed border-green-dark/20 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-dark mb-1.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Ejecuci&oacute;n autom&aacute;tica
              </div>
              <p className="text-xs text-gray-500">Se ejecuta cada hora mediante el planificador, y en tiempo real ante cada evento del sistema.</p>
            </div>

            <button onClick={runEngine} disabled={rulesLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 cursor-pointer font-sans transition-all hover:bg-gray-200 hover:text-gray-900 disabled:opacity-60">
              {rulesLoading ? (
                <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {rulesLoading ? "Procesando..." : "Ejecutar ahora"}
            </button>

            {rulesResult && (
              <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-100">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-green-dark fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm font-semibold text-green-800">{rulesResult.message}</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <span className="text-gray-400 font-medium">Categor&iacute;a</span>
                    <span className="text-right text-gray-400 font-medium">Alertas (+/-)</span>
                    <span className="text-gray-600">Pesaje</span>
                    <span className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-medium mr-1">+{rulesResult.detalles.peso_alertas_creadas}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">&ndash;{rulesResult.detalles.peso_alertas_resueltas}</span>
                    </span>
                    <span className="text-gray-600">Ocupaci&oacute;n</span>
                    <span className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-medium mr-1">+{rulesResult.detalles.ocupacion_alertas_creadas}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">&ndash;{rulesResult.detalles.ocupacion_alertas_resueltas}</span>
                    </span>
                    <span className="text-gray-600">Clima</span>
                    <span className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-medium mr-1">+{rulesResult.detalles.clima_alertas_creadas}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">&ndash;{rulesResult.detalles.clima_alertas_resueltas}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {rulesError && (
              <div className="mt-5 flex items-center gap-2 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-sm text-red-700">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {rulesError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
