"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

interface CorralOption {
  id: number;
  nombre: string;
  codigo: string;
}

export default function NuevoAnimalPage() {
  const [corrales, setCorrales] = useState<CorralOption[]>([]);
  const [form, setForm] = useState({
    codigo_caravana: "",
    corral_id: "",
    raza: "",
    sexo: "",
    fecha_nacimiento: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    peso_ingreso_kg: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    api.get("/corrales").then((res) => setCorrales(res.data));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post("/animales", {
        ...form,
        corral_id: Number(form.corral_id),
        peso_ingreso_kg: form.peso_ingreso_kg ? Number(form.peso_ingreso_kg) : null,
        fecha_nacimiento: form.fecha_nacimiento || null,
      });
      addToast("success", "Animal registrado correctamente.");
      router.push("/animales");
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
        <Link href="/animales" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:bg-gray-50 hover:text-gray-600">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Registrar Animal</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Completa los datos del nuevo animal</p>
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
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-green-dark fill-none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Datos del Animal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label htmlFor="codigo_caravana" className="block text-[13px] font-medium text-gray-600 mb-1.5">C&oacute;digo de Caravana <span className="text-primary">*</span></label>
                <input type="text" id="codigo_caravana" value={form.codigo_caravana} onChange={(e) => setForm({ ...form, codigo_caravana: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300" placeholder="Ej: AR-001-234" />
                {errors.codigo_caravana && <span className="text-xs text-primary mt-1 block">{errors.codigo_caravana}</span>}
              </div>

              <div>
                <label htmlFor="raza" className="block text-[13px] font-medium text-gray-600 mb-1.5">Raza</label>
                <input type="text" id="raza" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })}
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300" placeholder="Ej: Angus" />
                {errors.raza && <span className="text-xs text-primary mt-1 block">{errors.raza}</span>}
              </div>

              <div>
                <label htmlFor="sexo" className="block text-[13px] font-medium text-gray-600 mb-1.5">Sexo <span className="text-primary">*</span></label>
                <select id="sexo" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)]">
                  <option value="">Seleccionar</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
                {errors.sexo && <span className="text-xs text-primary mt-1 block">{errors.sexo}</span>}
              </div>

              <div>
                <label htmlFor="corral_id" className="block text-[13px] font-medium text-gray-600 mb-1.5">Corral <span className="text-primary">*</span></label>
                <select id="corral_id" value={form.corral_id} onChange={(e) => setForm({ ...form, corral_id: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)]">
                  <option value="">Seleccionar corral</option>
                  {corrales.map((c) => (<option key={c.id} value={c.id}>{c.nombre} ({c.codigo})</option>))}
                </select>
                {errors.corral_id && <span className="text-xs text-primary mt-1 block">{errors.corral_id}</span>}
              </div>

              <div>
                <label htmlFor="fecha_ingreso" className="block text-[13px] font-medium text-gray-600 mb-1.5">Fecha de Ingreso <span className="text-primary">*</span></label>
                <input type="date" id="fecha_ingreso" value={form.fecha_ingreso} onChange={(e) => setForm({ ...form, fecha_ingreso: e.target.value })} required
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)]" />
                {errors.fecha_ingreso && <span className="text-xs text-primary mt-1 block">{errors.fecha_ingreso}</span>}
              </div>

              <div>
                <label htmlFor="fecha_nacimiento" className="block text-[13px] font-medium text-gray-600 mb-1.5">Fecha de Nacimiento</label>
                <input type="date" id="fecha_nacimiento" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)]" />
                {errors.fecha_nacimiento && <span className="text-xs text-primary mt-1 block">{errors.fecha_nacimiento}</span>}
              </div>

              <div>
                <label htmlFor="peso_ingreso_kg" className="block text-[13px] font-medium text-gray-600 mb-1.5">Peso de Ingreso (kg)</label>
                <input type="number" step="0.01" id="peso_ingreso_kg" value={form.peso_ingreso_kg} onChange={(e) => setForm({ ...form, peso_ingreso_kg: e.target.value })}
                  className="w-full h-[40px] px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white font-sans outline-none transition-all focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.1)] placeholder:text-gray-300" placeholder="Ej: 280" />
                {errors.peso_ingreso_kg && <span className="text-xs text-primary mt-1 block">{errors.peso_ingreso_kg}</span>}
              </div>
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
              {loading ? "Guardando..." : "Guardar Registro"}
            </button>
            <Link href="/animales"
              className="inline-flex items-center px-[22px] py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 no-underline transition-all hover:bg-gray-50 hover:text-gray-700">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
