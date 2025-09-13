'use client'

import { useState, useEffect } from 'react'
import { pwaInstallPrompt, getDevicePlatform, getInstallInstructions, isStandalone } from '@/lib/pwa'

interface PWAInstallPromptProps {
  onDismiss?: () => void
}

export default function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [platform, setPlatform] = useState<string>('unknown')
  const [canShowNativePrompt, setCanShowNativePrompt] = useState(false)

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) {
      return
    }

    // Don't show if previously dismissed
    if (pwaInstallPrompt.wasPromptDismissed()) {
      return
    }

    const currentPlatform = getDevicePlatform()
    setPlatform(currentPlatform)

    // Check if native prompt is available
    setCanShowNativePrompt(pwaInstallPrompt.canShowPrompt())

    // Show prompt after a delay
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleInstall = async () => {
    if (canShowNativePrompt) {
      // Try native install prompt
      const accepted = await pwaInstallPrompt.showInstallPrompt()
      if (accepted) {
        setShowPrompt(false)
      }
    } else {
      // Show manual instructions
      alert(getInstallInstructions(platform))
    }
  }

  const handleDismiss = () => {
    pwaInstallPrompt.markPromptDismissed()
    setShowPrompt(false)
    onDismiss?.()
  }

  if (!showPrompt || isStandalone()) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-sm mx-auto">
        <div className="flex items-start space-x-3">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#023801] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Install Socai Mini
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Get quick access from your home screen
            </p>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="bg-[#023801] text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-[#034a01] transition-colors"
            >
              Install
            </button>
          </div>
        </div>

        {/* Manual Instructions for iOS */}
        {platform === 'ios' && !canShowNativePrompt && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-blue-800">
                Tap <strong>Share</strong> then <strong>&quot;Add to Home Screen&quot;</strong> to install
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}