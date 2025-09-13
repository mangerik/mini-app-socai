'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { hasEnoughTokens, deductTokens } from '@/lib/tokenManager'

export default function Generate() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('uploading') // uploading, generating, completing
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const processVideoGeneration = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/otp')
          return
        }

        // Check if user has enough tokens
        const hasTokens = await hasEnoughTokens(session.user.id)
        if (!hasTokens) {
          // Redirect to token exhausted page
          router.push('/tokens-exhausted')
          return
        }

        // Get cached image
        const cachedImage = localStorage.getItem('socai_cached_image')
        const imageName = localStorage.getItem('socai_cached_image_name')
        const imageType = localStorage.getItem('socai_cached_image_type')

        if (!cachedImage) {
          router.push('/upload')
          return
        }

        // Update progress - uploading
        setStatus('uploading')
        setProgress(20)

        // Convert base64 to blob
        const base64Data = cachedImage.split(',')[1]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: imageType || 'image/jpeg' })

        setProgress(40)
        setStatus('generating')

        // Create FormData for FAL AI API
        const formData = new FormData()
        formData.append('file', blob, imageName || 'image.jpg')

        setProgress(60)

        // Call FAL AI API route
        const response = await fetch('/api/generate', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to generate video')
        }

        const generationData = await response.json()

        setProgress(90)
        setStatus('completing')

        // Simulate final processing time
        await new Promise(resolve => setTimeout(resolve, 1000))

        setProgress(100)

        // Deduct tokens after successful generation
        const updatedTokens = await deductTokens(session.user.id)
        if (updatedTokens) {
          console.log(`Tokens deducted. Remaining: ${updatedTokens.tokens}`)
        }

        // Store result and redirect
        localStorage.setItem('socai_video_result', JSON.stringify({
          ...generationData,
          tokens_used: 25
        }))
        
        // Clean up cached image
        localStorage.removeItem('socai_cached_image')
        localStorage.removeItem('socai_cached_image_name')
        localStorage.removeItem('socai_cached_image_type')

        // Redirect to result
        router.push('/result')

      } catch (error) {
        console.error('Generation error:', error)
        setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses video')
      }
    }

    processVideoGeneration()
  }, [router])

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Mengupload foto...'
      case 'generating':
        return 'Membuat video AI...'
      case 'completing':
        return 'Menyelesaikan proses...'
      default:
        return 'Memproses...'
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center">
        <div className="max-w-sm mx-auto px-6 md:max-w-md">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Oops! Ada Masalah
              </h1>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              
              <button
                onClick={() => router.push('/upload')}
                className="bg-[#023801] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#034a01] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center">
      <div className="max-w-sm mx-auto px-6 md:max-w-md">
        <div className="text-center space-y-8">
          {/* AI Robot Animation */}
          <div className="relative">
            <div className="w-24 h-24 bg-[#023801] rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Status Text */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getStatusText()}
            </h1>
            <p className="text-gray-600">
              Tunggu sebentar, AI sedang bekerja untuk kamu 🤖
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#023801] to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {progress}% selesai
            </p>
          </div>

          {/* Fun Facts */}
          <div className="p-4 bg-white/50 rounded-xl border border-green-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">💡 Tahukah kamu?</span><br />
              AI kami menganalisis wajah dan gerakan untuk menciptakan video yang natural dan menarik
            </p>
          </div>

          {/* Don't close warning */}
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-700">
              ⚠️ Jangan tutup halaman ini sampai proses selesai
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}