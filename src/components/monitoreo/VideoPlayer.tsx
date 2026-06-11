'use client'

import React, { useRef, useEffect } from 'react'

interface VideoPlayerProps {
  streamUrl: string | null
  cameraName: string
  activa: boolean
}

export function VideoPlayer({ streamUrl, cameraName, activa }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !streamUrl || !activa) return

    const vid: HTMLVideoElement = el
    const url: string = streamUrl
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
  }, [streamUrl, activa])

  if (!activa || !streamUrl) {
    return (
      <div className="w-full aspect-video bg-gray-800 flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">{cameraName}</span>
        <span className="text-xs mt-1">{!activa ? 'Cámara offline' : 'Sin stream'}</span>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className="w-full aspect-video object-cover bg-gray-800"
      autoPlay
      muted
      playsInline
    />
  )
}
