"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Las credenciales no son correctas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <img src="/images/login-bg.jpg" alt="" className="w-full h-full object-cover object-center animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(5,18,5,0.90)] via-[rgba(15,45,15,0.82)] via-[rgba(35,80,35,0.65)] to-[rgba(45,106,45,0.40)]" />
      </div>

      <div className="relative z-10 min-h-screen flex">
          <div className="hidden lg:flex flex-1 flex-col justify-between p-14 pb-12">
          <div className="flex items-center gap-3 animate-slideUp">
            <div className="w-11 h-11 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center backdrop-blur-lg">
              <svg fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-tight">GanadoVision</div>
              <div className="text-white/40 text-[11px]">Sistema de monitoreo feedlot</div>
            </div>
          </div>

          <div className="animate-slideUp" style={{ animationDelay: "0.15s" }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/18 backdrop-blur-xl rounded-full px-3.5 py-1.5 text-xs text-white/80 mb-5">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="block w-2 h-2 rounded-full bg-green-400" />
              </span>
              Sistema activo — Monitoreo en tiempo real
            </div>

            <h1 className="font-['Playfair_Display'] text-[clamp(40px,4.5vw,60px)] font-black text-white leading-[1.08] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
              Monitoreo<br /><em className="italic text-accent not-italic">inteligente</em><br />de ganado
            </h1>

            <p className="text-white/60 text-[15px] leading-[1.7] max-w-[400px] mb-9">
              Visión artificial, trazabilidad completa y alertas automáticas para la gestión eficiente de tu feedlot.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-[340px]">
              {[["24/7", "Monitoreo"], ["YOLO", "Detección IA"], ["100%", "Trazabilidad"]].map(([num, lbl]) => (
                <div key={lbl} className="bg-white/9 border border-white/16 backdrop-blur-xl rounded-2xl p-4 text-center">
                  <div className={`text-[26px] font-bold text-white ${num === "YOLO" ? "text-accent" : ""}`}>{num}</div>
                  <div className="text-[11px] text-white/45 mt-1">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-white/22 animate-slideUp" style={{ animationDelay: "0.45s" }}>GanadoVision &copy; {new Date().getFullYear()}</div>
        </div>

        <div className="w-full lg:w-auto lg:min-w-[460px] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[400px] bg-white/96 rounded-[28px] p-10 px-9 shadow-[0_32px_80px_rgba(0,0,0,0.50),0_0_0_1px_rgba(255,255,255,0.08)] animate-[slideUp_0.55s_ease_both]">
            <div className="flex items-center gap-2.5 mb-7 lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-green-dark flex items-center justify-center">
                <svg fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-[17px] text-[#111] tracking-tight">GanadoVision</span>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-green-dark mb-1.5">Bienvenido de vuelta</div>
            <h2 className="font-[--font-playfair] text-[30px] font-bold text-[#111] leading-[1.15] mb-1.5">Accedé al<br />sistema</h2>
            <p className="text-[13px] text-[#9ca3af] mb-7">Ingresá tus credenciales para continuar</p>

            {error && (
              <div className="flex items-start gap-3 bg-[#fff1f0] border border-[#fecaca] rounded-xl p-3.5 mb-5">
                <div className="w-[30px] h-[30px] rounded-full bg-primary flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-white"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-primary">Credenciales incorrectas</div>
                  <div className="text-xs text-[#9ca3af] mt-0.5">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280] mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                    <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full py-3 pl-10 pr-3.5 border-[1.5px] border-[#e5e7eb] rounded-xl bg-[#f9fafb] text-sm text-[#111] font-sans transition-[border-color,box-shadow] duration-200 placeholder:text-[#d1d5db] hover:border-[#d1d5db] focus:outline-none focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.12)] focus:bg-white" placeholder="usuario@ejemplo.com" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280] mb-1.5">Contraseña</label>
                <div className="relative">
                  <div className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                    <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full py-3 pl-10 pr-10 border-[1.5px] border-[#e5e7eb] rounded-xl bg-[#f9fafb] text-sm text-[#111] font-sans transition-[border-color,box-shadow] duration-200 placeholder:text-[#d1d5db] hover:border-[#d1d5db] focus:outline-none focus:border-green-dark focus:shadow-[0_0_0_3px_rgba(45,106,45,0.12)] focus:bg-white" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 right-3 -translate-y-1/2 bg-none border-none cursor-pointer p-1 text-[#9ca3af] hover:text-[#6b7280]">
                    {showPass ? (
                      <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded accent-green-dark cursor-pointer" />
                <label htmlFor="remember" className="text-[13px] text-[#6b7280] cursor-pointer">Recordarme</label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 border-none rounded-xl text-white text-sm font-semibold tracking-[0.02em] font-sans cursor-pointer flex items-center justify-center gap-2 transition-[transform,box-shadow] duration-150 active:scale-[0.98] disabled:opacity-70 animate-gradShift" style={{
                background: "linear-gradient(270deg, #1a3d1a, #2D6A2D, #3B6D11, #639922, #2D6A2D) 0% 50% / 300% 300%",
              }}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
                {!loading && (
                  <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                )}
              </button>
            </form>

            <div className="mt-7 pt-5 border-t border-[#f3f4f6] flex items-center justify-center gap-2.5 text-xs text-[#9ca3af]">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 opacity-70 animate-ping" />
                <span className="block w-2 h-2 rounded-full bg-green-400" />
              </span>
              Sistema operativo
              <span className="text-[#e5e7eb]">·</span>
              GanadoVision &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
