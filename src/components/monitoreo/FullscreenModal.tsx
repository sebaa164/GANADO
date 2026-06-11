'use client'

import React, { useEffect, useRef } from 'react'
import { useMonitoreoStore } from '@/stores/monitoreoStore'

export function FullscreenModal() {
  const fullscreenCam = useMonitoreoStore((s) => s.fullscreenCam)
  const setFullscreenCam = useMonitoreoStore((s) => s.setFullscreenCam)
  const camaras = useMonitoreoStore((s) => s.camaras)
  const videoRef = useRef<HTMLVideoElement>(null)

  const camara = camaras.find((c) => c.id === fullscreenCam)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFullscreenCam(null)
    }
    if (fullscreenCam !== null) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [fullscreenCam, setFullscreenCam])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !camara || !camara.stream_url || !camara.activa) return

    const vid: HTMLVideoElement = el
    const url: string = camara.stream_url
    let hlsInstance: unknown = null

    async function initHls() {
      if (url.includes('.m3u8')) {
        try {
          const Hls = (await import('hls.js')).default
          if (Hls.isSupported()) {
            hlsInstance = new Hls()
            ;(hlsInstance as any).loadSource(url)
            ;(hlsInstance as any).attachMedia(vid)
            ;(hlsInstance as any).on(Hls.Events.MANIFEST_PARSED, () => {
              vid.play().catch(() => {})
            })
          } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = url
          }
        } catch {
          vid.src = url
        }
      } else {
        vid.src = url
      }
    }

    initHls()
    return () => {
      if (hlsInstance) {
        try {
          ;(hlsInstance as any).destroy()
        } catch {}
      }
    }
  }, [camara])

  if (fullscreenCam === null) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={() => setFullscreenCam(null)}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/30 rounded-lg p-2 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {camara?.activa && camara.stream_url ? (
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain"
          autoPlay
          muted
          playsInline
          controls
        />
      ) : (
        <div className="text-gray-400 text-center">
          <svg className="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Cámara offline</p>
        </div>
      )}
    </div>
  )
}
