'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa'
import PWAInstallPrompt from './PWAInstallPrompt'
import SupabaseConfigWarning from './SupabaseConfigWarning'

interface PWAWrapperProps {
  children: React.ReactNode
}

export default function PWAWrapper({ children }: PWAWrapperProps) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('Service Worker registered successfully')
      }
    })

    // Handle PWA-related browser events
    const handleBeforeInstallPrompt = () => {
      console.log('beforeinstallprompt event fired')
      // Event is handled by PWAInstallPrompt component
    }

    const handleAppInstalled = () => {
      console.log('PWA app installed')
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return (
    <>
      <SupabaseConfigWarning />
      {children}
      <PWAInstallPrompt />
    </>
  )
}