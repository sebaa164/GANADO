import { create } from 'zustand'

export interface Camara {
  id: number
  nombre: string
  corral_id: number
  corral_nombre: string
  ubicacion: string | null
  stream_url: string | null
  activa: boolean
  detecciones: Deteccion[]
}

export interface Deteccion {
  x: number
  y: number
  w: number
  h: number
  label: string
  confianza: number
}

export interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: 'critica' | 'advertencia'
  hora: string
  visible: boolean
}

interface MonitoreoState {
  camaras: Camara[]
  selectedLocation: string
  gridSize: '2x2' | '3x3'
  fullscreenCam: number | null
  notificaciones: Notificacion[]
  notifIdCounter: number

  // Computed (actualizadas manualmente)
  camarasOnline: number
  camarasOffline: number

  // Actions
  setCamaras: (camaras: Camara[]) => void
  setGridSize: (size: '2x2' | '3x3') => void
  setSelectedLocation: (loc: string) => void
  setFullscreenCam: (id: number | null) => void
  agregarNotificacion: (titulo: string, mensaje: string, tipo: 'critica' | 'advertencia') => void
  descartarNotificacion: (id: number) => void
  contarEstado: () => void
  actualizarDetecciones: (camaraId: number, detecciones: Deteccion[]) => void
}

const mockCamaras: Camara[] = [
  { id: 1, nombre: 'CAM-001', corral_id: 1, corral_nombre: 'Corral Norte', ubicacion: 'Norte', stream_url: null, activa: true, detecciones: [] },
  { id: 2, nombre: 'CAM-002', corral_id: 2, corral_nombre: 'Corral Sur', ubicacion: 'Sur', stream_url: null, activa: false, detecciones: [] },
  { id: 3, nombre: 'CAM-003', corral_id: 1, corral_nombre: 'Corral Norte', ubicacion: 'Comedero', stream_url: null, activa: true, detecciones: [] },
  { id: 4, nombre: 'CAM-004', corral_id: 3, corral_nombre: 'Corral Este', ubicacion: 'Este', stream_url: null, activa: true, detecciones: [] },
]

export const useMonitoreoStore = create<MonitoreoState>((set, get) => ({
  camaras: mockCamaras,
  selectedLocation: 'all',
  gridSize: '2x2',
  fullscreenCam: null,
  notificaciones: [],
  notifIdCounter: 0,
  camarasOnline: 3,
  camarasOffline: 1,

  setCamaras: (camaras) => {
    set({ camaras })
    get().contarEstado()
  },

  setGridSize: (gridSize) => set({ gridSize }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setFullscreenCam: (fullscreenCam) => set({ fullscreenCam }),

  agregarNotificacion: (titulo, mensaje, tipo) => {
    const state = get()
    const id = state.notifIdCounter + 1
    const notif: Notificacion = {
      id,
      titulo,
      mensaje,
      tipo,
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      visible: true,
    }
    const notificaciones = [notif, ...state.notificaciones].slice(0, 5)
    set({ notificaciones, notifIdCounter: id })
  },

  descartarNotificacion: (id) => {
    const notificaciones = get().notificaciones.map((n) =>
      n.id === id ? { ...n, visible: false } : n
    )
    set({ notificaciones })
    setTimeout(() => {
      set((s) => ({ notificaciones: s.notificaciones.filter((n) => n.visible) }))
    }, 300)
  },

  contarEstado: () => {
    const camaras = get().camaras
    const online = camaras.filter((c) => c.activa).length
    set({ camarasOnline: online, camarasOffline: camaras.length - online })
  },

  actualizarDetecciones: (camaraId, detecciones) => {
    set((s) => ({
      camaras: s.camaras.map((c) =>
        c.id === camaraId ? { ...c, detecciones } : c
      ),
    }))
  },
}))
