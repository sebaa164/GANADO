"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

export default function NuevoCorralPage() {
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    capacidad_maxima: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post("/corrales", {
        ...form,
        capacidad_maxima: Number(form.capacidad_maxima),
      });
      addToast("success", "Corral registrado correctamente.");
      router.push("/corrales");
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          validationErrors[key] = (msgs as string[])[0];
        }
        setErrors(validationErrors);
      } else {
        setErrors({ _general: "Error al guardar. Intente nuevamente." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/corrales" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:bg-gray-50 hover:text-gray-600">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Nuevo Corral</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Completa los datos para registrar un nuevo corral</p>
        </div>
      </div>

      {errors._general && (
        <div className="flex items-center gap-2.5 bg-[#fff1f0] border border-[#fecaca] rounded-xl p-3.5 mb-5">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-white"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
          <span className="text-[13px] text-red-700">{errors._general}</span>
        </div>
      )}

      <div className="max-w-[640px]">
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-green-dark fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Datos del Corral
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label htmlFor="nombre" className="block text-[13px] font-medium text-gray-600 mb-1.5">Nombre del Corral <span className="text-primary">*</span></label>
                <input type="text" id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300" placeholder="Ej: Corral Norte" />
                {errors.nombre && <span className="text-xs text-primary mt-1 block">{errors.nombre}</span>}
              </div>

              <div>
                <label htmlFor="codigo" className="block text-[13px] font-medium text-gray-600 mb-1.5">C&oacute;digo <span className="text-primary">*</span></label>
                <input type="text" id="codigo" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300" placeholder="Ej: C-NORTE-01" />
                {errors.codigo && <span className="text-xs text-primary mt-1 block">{errors.codigo}</span>}
              </div>

              <div>
                <label htmlFor="capacidad_maxima" className="block text-[13px] font-medium text-gray-600 mb-1.5">Capacidad M&aacute;xima (animales) <span className="text-primary">*</span></label>
                <input type="number" min="1" id="capacidad_maxima" value={form.capacidad_maxima} onChange={(e) => setForm({ ...form, capacidad_maxima: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)]" placeholder="Ej: 50" />
                {errors.capacidad_maxima && <span className="text-xs text-primary mt-1 block">{errors.capacidad_maxima}</span>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="descripcion" className="block text-[13px] font-medium text-gray-600 mb-1.5">Descripci&oacute;n</label>
              <textarea id="descripcion" rows={4} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300 resize-y" placeholder="Ubicaci&oacute;n y caracter&iacute;sticas del corral..." />
              {errors.descripcion && <span className="text-xs text-primary mt-1 block">{errors.descripcion}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 bg-green-dark text-white px-[22px] py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer font-sans transition-all hover:bg-[#224f22] active:scale-[0.98] disabled:opacity-70">
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              )}
              {loading ? "Guardando..." : "Guardar Corral"}
            </button>
            <Link href="/corrales"
              className="inline-flex items-center px-[22px] py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 no-underline transition-all hover:bg-gray-50 hover:text-gray-700">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
