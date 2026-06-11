import { create } from 'zustand'

// Coordenadas del campo (centro)
export const CENTRO_FINCA: [number, number] = [-33.3435, -66.0574167]

export interface CorralGeo {
  id: number
  nombre: string
  vertices: [number, number][] // polygon lat,lng
  animales_count: number
}

export interface AntennaRFID {
  id: number
  nombre: string
  posicion: [number, number]
  estado: 'activa' | 'offline' | 'mantenimiento'
  ultima_lectura: string
}

export interface AnimalMarker {
  id: number
  arete: string
  nombre: string
  posicion: [number, number]
  corral_id: number
  corral_nombre: string
  lote: string
  temperatura: number
  peso: number
  ultima_lectura: string
  estado_salud: 'normal' | 'alerta' | 'critico'
}

interface MapaState {
  corrales: CorralGeo[]
  antenas: AntennaRFID[]
  animales: AnimalMarker[]
  filtroCorral: number | null
  filtroLote: string
  selectedAnimal: AnimalMarker | null
  satelite: boolean

  setFiltroCorral: (id: number | null) => void
  setFiltroLote: (lote: string) => void
  setSelectedAnimal: (a: AnimalMarker | null) => void
  setSatelite: (v: boolean) => void

  lotesDisponibles: () => string[]
  animalesFiltrados: () => AnimalMarker[]
}

const lotes = ['Lote A', 'Lote B', 'Lote C', 'Lote D']

const mockCorrales: CorralGeo[] = [
  {
    id: 1, nombre: 'Corral Norte',
    vertices: [
      [-33.338, -66.062], [-33.338, -66.054], [-33.344, -66.054], [-33.344, -66.062],
    ],
    animales_count: 45,
  },
  {
    id: 2, nombre: 'Corral Sur',
    vertices: [
      [-33.346, -66.062], [-33.346, -66.054], [-33.352, -66.054], [-33.352, -66.062],
    ],
    animales_count: 38,
  },
  {
    id: 3, nombre: 'Corral Este',
    vertices: [
      [-33.338, -66.050], [-33.338, -66.044], [-33.352, -66.044], [-33.352, -66.050],
    ],
    animales_count: 52,
  },
  {
    id: 4, nombre: 'Zona Alimentación',
    vertices: [
      [-33.343, -66.064], [-33.343, -66.060], [-33.347, -66.060], [-33.347, -66.064],
    ],
    animales_count: 12,
  },
]

const mockAntenas: AntennaRFID[] = [
  { id: 1, nombre: 'Antena N-E',   posicion: [-33.339, -66.055], estado: 'activa', ultima_lectura: '2026-06-11 11:58' },
  { id: 2, nombre: 'Antena N-O',   posicion: [-33.339, -66.061], estado: 'activa', ultima_lectura: '2026-06-11 11:57' },
  { id: 3, nombre: 'Antena S',     posicion: [-33.350, -66.058], estado: 'offline', ultima_lectura: '2026-06-10 09:12' },
  { id: 4, nombre: 'Antena E',     posicion: [-33.345, -66.046], estado: 'activa', ultima_lectura: '2026-06-11 11:59' },
  { id: 5, nombre: 'Antena Comedero', posicion: [-33.345, -66.062], estado: 'mantenimiento', ultima_lectura: '2026-06-09 14:30' },
]

function generarAnimales(): AnimalMarker[] {
  const nombres = ['Luna', 'Sol', 'Estrella', 'Bravo', 'Chispa', 'Relámpago', 'Aurora', 'Tormenta', 'Rayo', 'Brisa',
    'Canela', 'Miel', 'Oro', 'Plata', 'Bronce', 'Rosa', 'Clavel', 'Jazmín', 'Lirio', 'Violeta']
  const animales: AnimalMarker[] = []
  for (let i = 1; i <= 135; i++) {
    const corral = mockCorrales[i % mockCorrales.length]
    const lote = lotes[i % lotes.length]
    const bbox = corral.vertices
    const minLat = Math.min(...bbox.map(v => v[0]))
    const maxLat = Math.max(...bbox.map(v => v[0]))
    const minLng = Math.min(...bbox.map(v => v[1]))
    const maxLng = Math.max(...bbox.map(v => v[1]))
    const pos: [number, number] = [
      minLat + Math.random() * (maxLat - minLat),
      minLng + Math.random() * (maxLng - minLng),
    ]
    const salud: AnimalMarker['estado_salud'] = i % 10 === 0 ? 'alerta' : i % 25 === 0 ? 'critico' : 'normal'
    animales.push({
      id: i,
      arete: `AR-${String(i).padStart(4, '0')}`,
      nombre: nombres[i % nombres.length] + (Math.floor(i / nombres.length) > 0 ? ` ${Math.floor(i / nombres.length)}` : ''),
      posicion: pos,
      corral_id: corral.id,
      corral_nombre: corral.nombre,
      lote,
      temperatura: 38.5 + Math.random() * 1.5,
      peso: 350 + Math.floor(Math.random() * 200),
      ultima_lectura: '2026-06-11 11:' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
      estado_salud: salud,
    })
  }
  return animales
}

export const useMapaStore = create<MapaState>((set, get) => ({
  corrales: mockCorrales,
  antenas: mockAntenas,
  animales: generarAnimales(),
  filtroCorral: null,
  filtroLote: '',
  selectedAnimal: null,
  satelite: true,

  setFiltroCorral: (filtroCorral) => set({ filtroCorral }),
  setFiltroLote: (filtroLote) => set({ filtroLote }),
  setSelectedAnimal: (selectedAnimal) => set({ selectedAnimal }),
  setSatelite: (satelite) => set({ satelite }),

  lotesDisponibles: () => {
    const lotesSet = new Set(get().animales.map(a => a.lote))
    return Array.from(lotesSet).sort()
  },

  animalesFiltrados: () => {
    const { animales, filtroCorral, filtroLote } = get()
    return animales.filter(a => {
      if (filtroCorral !== null && a.corral_id !== filtroCorral) return false
      if (filtroLote !== '' && a.lote !== filtroLote) return false
      return true
    })
  },
}))
