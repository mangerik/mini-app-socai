'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function SupabaseConfigWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Only show warning in development and if Supabase is not configured
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isConfigured = isSupabaseConfigured()
    
    if (isDevelopment && !isConfigured) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-sm">
      <div className="max-w-sm mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Supabase not configured</span>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="ml-4 text-yellow-700 hover:text-yellow-900"
        >
          ×
        </button>
      </div>
      <div className="max-w-sm mx-auto mt-1 text-xs">
        Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
      </div>
    </div>
  )
}