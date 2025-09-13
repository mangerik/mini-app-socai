'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getTokenStats } from '@/lib/tokenManager'

export default function TokensExhausted() {
  const [tokenStats, setTokenStats] = useState<{
    totalVideos: number;
    usedTokens: number;
    remainingTokens: number;
    totalTokens: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTokenStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const stats = await getTokenStats(session.user.id)
          setTokenStats(stats)
        }
      } catch (error) {
        console.error('Error loading token stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTokenStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#023801]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ups! Token Kamu Habis 😅
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            Kamu sudah menggunakan semua token gratis. 
            Tapi tenang, masih bisa lanjut generate video!
          </p>
        </div>

        {/* Token Usage Stats */}
        {tokenStats && (
          <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">
              Penggunaan Token Kamu
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total video dibuat</span>
                <span className="font-bold text-gray-900">{tokenStats.totalVideos}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Token terpakai</span>
                <span className="font-bold text-red-600">{tokenStats.usedTokens}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Token tersisa</span>
                <span className="font-bold text-orange-600">{tokenStats.remainingTokens}</span>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                    style={{ width: `${(tokenStats.usedTokens / tokenStats.totalTokens) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {tokenStats.usedTokens} dari {tokenStats.totalTokens} token terpakai
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main CTA */}
        <div className="space-y-4 mb-8">
          <a
            href="https://socai.id?utm_source=miniapp&utm_medium=tokens_exhausted&utm_campaign=upgrade"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#023801] text-white font-bold py-4 px-6 rounded-xl text-center hover:bg-[#034a01] transition-colors shadow-lg"
          >
            🚀 Langganan di Socai.id
          </a>
          
          <p className="text-xs text-center text-gray-500">
            Dapatkan akses unlimited + fitur premium lainnya
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-3 text-center">
            🎯 Keuntungan Berlangganan
          </h3>
          
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Generate video AI unlimited</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Kualitas video HD</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Custom prompt & advanced editing</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Priority processing (lebih cepat)</span>
            </li>
          </ul>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl text-center hover:bg-gray-50 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          
          <div className="text-center">
            <a
              href="https://socai.id/pricing?utm_source=miniapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-[#023801] transition-colors underline"
            >
              Lihat paket berlangganan →
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tips:</strong> Share mini app ini ke teman untuk berbagi keseruan AI video generator!
          </p>
        </div>
      </div>
    </div>
  )
}