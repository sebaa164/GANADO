'use client'

import { useEffect, useRef, useState } from 'react'

interface UseCountUpOptions {
  target: number
  /** Animation duration in ms. Defaults to 600. */
  duration?: number
  /** Decimal places. Defaults to 0. */
  decimals?: number
}

/**
 * Animates a numeric value from its previous state to `target`
 * using requestAnimationFrame easing.
 */
export function useCountUp({
  target,
  duration = 600,
  decimals = 0,
}: UseCountUpOptions): string {
  const [display, setDisplay] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return

    // Cancel any in-progress animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    startRef.current = null

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return display.toFixed(decimals)
}
