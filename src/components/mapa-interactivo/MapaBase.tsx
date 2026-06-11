'use client'

import { useEffect, useRef } from 'react'
import { CENTRO_FINCA, useMapaStore } from '@/stores/mapaStore'

export function MapaBase() {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)

  const corrales = useMapaStore((s) => s.corrales)
  const antenas = useMapaStore((s) => s.antenas)
  const satelite = useMapaStore((s) => s.satelite)
  const animalesFiltrados = useMapaStore((s) => s.animalesFiltrados)

  useEffect(() => {
    const el = mapRef.current
    if (!el || instanceRef.current) return

    async function initMap() {
      const L = (await import('leaflet')).default

      // Inyectar CSS de Leaflet via link (más confiable que dynamic import)
      const linkId = 'leaflet-css'
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(el!, {
        center: CENTRO_FINCA,
        zoom: 15,
        zoomControl: true,
      })

      instanceRef.current = map

      // Capa satélite inicial
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 20,
      }).addTo(map)

      // Geolocalización precisa con marcador visual
      if ('geolocation' in navigator) {
        let userMarker: any = null
        let accuracyCircle: any = null

        const onPosition = (pos: GeolocationPosition) => {
          const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          const accuracy = pos.coords.accuracy

          map.setView(latlng, 16)

          if (!userMarker) {
            // Marcador azul con pulso
            userMarker = L.marker(latlng, {
              icon: L.divIcon({
                className: '',
                html: `<div style="position:relative;width:28px;height:28px;">
                  <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);z-index:2;"></div>
                  <div style="position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:50%;background:rgba(59,130,246,0.3);animation:pulse-location 2s infinite;z-index:1;"></div>
                </div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              }),
              zIndexOffset: 1000,
            }).addTo(map)

            // Círculo de precisión
            accuracyCircle = L.circle(latlng, {
              radius: accuracy,
              color: '#3b82f6',
              weight: 1,
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
            }).addTo(map)
          } else {
            userMarker.setLatLng(latlng)
            accuracyCircle.setLatLng(latlng)
            accuracyCircle.setRadius(accuracy)
          }
        }

        navigator.geolocation.watchPosition(onPosition, () => {}, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      }
    }

    initMap()

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [])

  // Cambiar capa base
  useEffect(() => {
    const map = instanceRef.current
    if (!map) return

    async function cambiarCapa() {
      const L = (await import('leaflet')).default

      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) map.removeLayer(layer)
      })

      const url = satelite
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

      const attr = satelite
        ? '&copy; Esri, Maxar, Earthstar Geographics'
        : '&copy; OpenStreetMap contributors'

      L.tileLayer(url, { attribution: attr, maxZoom: 20 }).addTo(map)
    }

    cambiarCapa()
  }, [satelite])

  // Dibujar corrales
  useEffect(() => {
    const map = instanceRef.current
    if (!map) return

    async function dibujar() {
      const L = (await import('leaflet')).default
      const layerGroup = L.layerGroup()

      corrales.forEach((corral) => {
        const polygon = L.polygon(corral.vertices as any, {
          color: '#2D6A2D',
          weight: 3,
          opacity: 0.8,
          fillColor: '#2D6A2D',
          fillOpacity: 0.15,
        })

        polygon.bindTooltip(`<b style="color:#000">${corral.nombre}</b><br/><span style="color:#000">${corral.animales_count} animales</span>`, {
          permanent: false,
          direction: 'center',
          className: 'corral-tooltip',
        })

        polygon.on('click', () => {
          useMapaStore.getState().setFiltroCorral(corral.id)
        })

        layerGroup.addLayer(polygon)

        const centro = corral.vertices.reduce(
          (acc, v) => [acc[0] + v[0], acc[1] + v[1]],
          [0, 0]
        )
        const centerLat = centro[0] / corral.vertices.length
        const centerLng = centro[1] / corral.vertices.length

        const label = L.marker([centerLat, centerLng], {
          icon: L.divIcon({
            className: 'corral-label',
            html: `<div style="font-size:11px;font-weight:600;color:#000;background:rgba(255,255,255,0.9);padding:2px 8px;border-radius:4px;white-space:nowrap;border:1px solid #2D6A2D;">${corral.nombre}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        })
        layerGroup.addLayer(label)
      })

      layerGroup.addTo(map)
    }

    dibujar()
  }, [corrales])

  // Colocar antenas
  useEffect(() => {
    const map = instanceRef.current
    if (!map) return

    async function colocar() {
      const L = (await import('leaflet')).default
      const layerGroup = L.layerGroup()

      antenas.forEach((ant) => {
        const estado = ant.estado
        const color = estado === 'activa' ? '#22c55e' : estado === 'offline' ? '#ef4444' : '#f59e0b'
        const estadoTexto = estado === 'activa' ? '🟢 Activa' : estado === 'offline' ? '🔴 Offline' : '🟡 Mantenimiento'

        const marker = L.marker(ant.posicion as any, {
          icon: L.divIcon({
            className: 'antena-marker',
            html: `<div style="width:24px;height:24px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-11h-2v6h2V9zm0 8h-2v2h2v-2z"/></svg>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })

        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:180px;color:#000;">
            <p style="font-weight:600;font-size:14px;margin:0 0 4px;color:#000;">${ant.nombre}</p>
            <p style="font-size:12px;color:#000;margin:0 0 2px;">${estadoTexto}</p>
            <p style="font-size:11px;color:#000;margin:0;">Última lectura: ${ant.ultima_lectura}</p>
          </div>
        `)
        layerGroup.addLayer(marker)
      })

      layerGroup.addTo(map)
    }

    colocar()
  }, [antenas])

  // Colocar animales con clustering
  useEffect(() => {
    const map = instanceRef.current
    if (!map) return

    async function colocarAnimales() {
      const L = (await import('leaflet')).default
      await import('leaflet.markercluster')
      await import('leaflet.markercluster/dist/MarkerCluster.css')
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css')

      const layerGroup = L.layerGroup()

      const clusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount()
          let color = '#2D6A2D'
          if (count > 10) color = '#f59e0b'
          if (count > 30) color = '#ef4444'
          return L.divIcon({
            html: `<div style="background:${color};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:3px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
            className: 'cluster-icon',
            iconSize: [36, 36],
          })
        },
      })

      const animales = animalesFiltrados()
      animales.forEach((animal) => {
        const color = animal.estado_salud === 'normal' ? '#2D6A2D' : animal.estado_salud === 'alerta' ? '#f59e0b' : '#ef4444'

        const marker = L.marker(animal.posicion as any, {
          icon: L.divIcon({
            className: 'animal-marker',
            html: `<div style="width:20px;height:20px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        })

        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:200px;color:#000;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <div style="width:10px;height:10px;border-radius:50%;background:${color};"></div>
              <p style="font-weight:600;font-size:14px;margin:0;color:#000;">${animal.nombre}</p>
            </div>
            <table style="font-size:12px;color:#000;width:100%;">
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Arete:</td><td style="font-weight:500;color:#000;">${animal.arete}</td></tr>
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Corral:</td><td style="font-weight:500;color:#000;">${animal.corral_nombre}</td></tr>
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Lote:</td><td style="font-weight:500;color:#000;">${animal.lote}</td></tr>
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Temp:</td><td style="font-weight:500;color:#000;">${animal.temperatura.toFixed(1)}°C</td></tr>
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Peso:</td><td style="font-weight:500;color:#000;">${animal.peso} kg</td></tr>
              <tr><td style="padding:1px 4px 1px 0;color:#000;">Última lectura:</td><td style="font-weight:500;color:#000;">${animal.ultima_lectura}</td></tr>
            </table>
            <a href="/animales/${animal.id}" style="display:inline-block;margin-top:8px;font-size:12px;color:#2D6A2D;font-weight:600;text-decoration:underline;">Ver detalle completo →</a>
          </div>
        `)

        marker.on('click', () => {
          useMapaStore.getState().setSelectedAnimal(animal)
        })

        clusterGroup.addLayer(marker)
      })

      layerGroup.addLayer(clusterGroup)
      layerGroup.addTo(map)
    }

    colocarAnimales()
  }, [animalesFiltrados()])

  return (
    <>
      <style>{`
        @keyframes pulse-location {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .leaflet-popup-content-wrapper,
        .leaflet-popup-content,
        .leaflet-popup-content *,
        .leaflet-tooltip,
        .leaflet-tooltip * {
          color: #000 !important;
          font-weight: 700 !important;
        }
        .leaflet-popup-content-wrapper {
          background: #fff !important;
        }
        .leaflet-tooltip {
          background: #fff !important;
          border: 1px solid #2D6A2D !important;
        }
        .leaflet-popup-content a,
        .leaflet-tooltip a {
          font-weight: 700 !important;
        }
        .leaflet-popup-content table td {
          font-weight: 700 !important;
        }
        .leaflet-container {
          font-family: Inter, sans-serif !important;
        }
      `}</style>
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '600px' }}
      />
    </>
  )
}
