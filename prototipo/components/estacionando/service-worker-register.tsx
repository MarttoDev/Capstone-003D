
'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Evitamos interferir con Next.js en modo desarrollo.
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    if (!('serviceWorker' in navigator)) {
      return
    }

    if (!window.isSecureContext) {
      return
    }

    function registerServiceWorker() {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
        })
        .catch((error) => {
          console.warn(
            'No se pudo registrar el Service Worker:',
            error,
          )
        })
    }

    if (document.readyState === 'complete') {
      registerServiceWorker()
      return
    }

    window.addEventListener('load', registerServiceWorker)

    return () => {
      window.removeEventListener(
        'load',
        registerServiceWorker,
      )
    }
  }, [])

  return null
}
