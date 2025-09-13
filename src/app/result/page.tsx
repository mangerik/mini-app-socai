'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getTokenStats } from '@/lib/tokenManager'

interface VideoResult {
  video_url: string
  video_id: string
  status: string
  tokens_used: number
}

export default function Result() {
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [tokenStats, setTokenStats] = useState<{
    remainingTokens: number;
    remainingVideos: number;
    canGenerateVideo: boolean;
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      // Get video result from localStorage
      const result = localStorage.getItem('socai_video_result')
      
      if (!result) {
        // No result found, redirect to home
        router.push('/')
        return
      }

      try {
        const parsedResult = JSON.parse(result)
        setVideoResult(parsedResult)
        
        // Load token stats
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const stats = await getTokenStats(session.user.id)
          setTokenStats(stats)
        }
      } catch (error) {
        console.error('Failed to parse video result:', error)
        router.push('/')
        return
      }

      setIsLoading(false)
    }
    
    loadData()
  }, [router])

  const handleDownload = async () => {
    if (!videoResult?.video_url) return

    try {
      const response = await fetch(videoResult.video_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `socai-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(videoResult.video_url, '_blank')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Video AI Saya dari Socai',
      text: 'Lihat video AI yang baru saja saya buat dengan Socai!',
      url: videoResult?.video_url || window.location.href
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Share failed:', error)
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    const videoUrl = videoResult?.video_url || window.location.href
    
    // Copy to clipboard
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = videoUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleWhatsAppShare = () => {
    const message = `Lihat video AI yang baru saya buat dengan Socai! ${videoResult?.video_url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCreateAnother = () => {
    // Clear result and start over
    localStorage.removeItem('socai_video_result')
    
    // Check if user has enough tokens
    if (tokenStats && !tokenStats.canGenerateVideo) {
      router.push('/tokens-exhausted')
    } else {
      router.push('/upload')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#023801]"></div>
      </div>
    )
  }

  if (!videoResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Video tidak ditemukan</p>
          <Link href="/" className="text-[#023801] font-medium hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Video kamu sudah jadi! 🎬
          </h1>
          <p className="text-gray-600">
            Download atau share sekarang
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-6">
          <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
            <video 
              src={videoResult.video_url}
              controls
              className="w-full aspect-video"
              preload="metadata"
            >
              <source src={videoResult.video_url} type="video/mp4" />
              Browser Anda tidak mendukung video HTML5.
            </video>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownload}
            className="w-full bg-[#023801] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#034a01] transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Video</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="bg-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-green-500 text-white font-medium py-3 px-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
              </svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Copy Link */}
        {copied && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
            <p className="text-sm text-green-600 text-center">
              ✓ Link berhasil disalin ke clipboard
            </p>
          </div>
        )}

        {/* Token Usage Info */}
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Token terpakai</p>
              <p className="text-xs text-blue-600">Untuk video ini</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                -{videoResult.tokens_used || 25}
              </p>
              <p className="text-xs text-blue-600">tokens</p>
            </div>
          </div>
          
          {tokenStats && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Sisa token:</span>
                <span className="font-bold text-blue-900">{tokenStats.remainingTokens}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-blue-700">Sisa video:</span>
                <span className="font-bold text-blue-900">{tokenStats.remainingVideos}</span>
              </div>
            </div>
          )}
        </div>

        {/* Create Another */}
        <div className="space-y-3">
          <button
            onClick={handleCreateAnother}
            className="w-full border-2 border-[#023801] text-[#023801] font-semibold py-3 px-6 rounded-xl hover:bg-[#023801] hover:text-white transition-colors"
          >
            Buat Video Lain
          </button>

          <div className="text-center">
            <Link 
              href="https://socai.id" 
              target="_blank"
              className="text-sm text-gray-500 hover:text-[#023801] transition-colors"
            >
              Token habis? Langganan di Socai.id →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}