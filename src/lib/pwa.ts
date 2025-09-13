// PWA Installation and Service Worker utilities

/**
 * Register service worker for PWA functionality
 */
export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('SW registered: ', registration)
          resolve(registration)
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError)
          resolve(null)
        }
      })
    } else {
      resolve(null)
    }
  })
}

/**
 * Check if PWA can be installed
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false
  }
  
  // Check if beforeinstallprompt event is supported
  return 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window
}

/**
 * Check if app is running in standalone mode (PWA installed)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true ||
    window.location.search.includes('homescreen=1')
  )
}

/**
 * Get device platform for PWA installation
 */
export function getDevicePlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  } else if (/windows|mac|linux/.test(userAgent)) {
    return 'desktop'
  }
  
  return 'unknown'
}

/**
 * Show install prompt for different platforms
 */
export function getInstallInstructions(platform: string): string {
  switch (platform) {
    case 'ios':
      return 'Tap the Share button and select "Add to Home Screen"'
    case 'android':
      return 'Tap the menu button and select "Add to Home Screen" or "Install App"'
    case 'desktop':
      return 'Click the install button in your browser\'s address bar'
    default:
      return 'Use your browser\'s menu to add this app to your home screen'
  }
}

/**
 * PWA Install Prompt Hook
 */
export class PWAInstallPrompt {
  private deferredPrompt: Event & { prompt?: () => void; userChoice?: Promise<{ outcome: string }> } | null = null
  private installPromptShown = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners()
    }
  }

  private setupEventListeners() {
    // Capture the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt fired')
      e.preventDefault()
      this.deferredPrompt = e
      this.installPromptShown = false
    })

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      this.deferredPrompt = null
      this.installPromptShown = true
    })
  }

  /**
   * Check if install prompt is available
   */
  canShowPrompt(): boolean {
    return this.deferredPrompt !== null && !this.installPromptShown
  }

  /**
   * Show the install prompt
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.canShowPrompt()) {
      return false
    }

    try {
      // Show the prompt
      if (this.deferredPrompt?.prompt) {
        this.deferredPrompt.prompt()
      }

      // Wait for the user to respond to the prompt
      const userChoice = await this.deferredPrompt?.userChoice
      const outcome = userChoice?.outcome || 'dismissed'

      console.log(`User choice: ${outcome}`)

      // Reset the deferred prompt
      this.deferredPrompt = null

      return outcome === 'accepted'
    } catch (error) {
      console.error('Error showing install prompt:', error)
      return false
    }
  }

  /**
   * Check if user has dismissed the install prompt before
   */
  wasPromptDismissed(): boolean {
    if (typeof window === 'undefined') return false
    
    const dismissed = localStorage.getItem('socai_install_prompt_dismissed')
    return dismissed === 'true'
  }

  /**
   * Mark install prompt as dismissed
   */
  markPromptDismissed() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('socai_install_prompt_dismissed', 'true')
    }
  }

  /**
   * Reset prompt dismissal (for testing)
   */
  resetPromptDismissal() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('socai_install_prompt_dismissed')
    }
  }
}

// Export singleton instance
export const pwaInstallPrompt = new PWAInstallPrompt()