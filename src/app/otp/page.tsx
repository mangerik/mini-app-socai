'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

type OTPStep = 'phone' | 'verify'

export default function OTP() {
  const [step, setStep] = useState<OTPStep>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOTP] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const router = useRouter()

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Check if user has cached image
  useEffect(() => {
    const cachedImage = localStorage.getItem('socai_cached_image')
    if (!cachedImage) {
      // Redirect back to upload if no cached image
      router.push('/upload')
    }
  }, [router])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')
    
    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      return '+62' + cleaned.slice(1)
    }
    
    // If starts with 62, add +
    if (cleaned.startsWith('62')) {
      return '+' + cleaned
    }
    
    // If doesn't start with anything, assume Indonesian number
    return '+62' + cleaned
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      setError('Nomor HP tidak boleh kosong')
      return
    }

    if (!isSupabaseConfigured()) {
      setError('Aplikasi sedang dalam mode development. Silakan konfigurasi Supabase untuk menggunakan fitur SMS OTP.')
      return
    }

    const formattedPhone = formatPhoneNumber(phone)
    
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (authError) {
        if (authError.message.includes('Supabase not configured')) {
          setError('Aplikasi sedang dalam mode development. SMS OTP tidak tersedia.')
        } else {
          setError('Gagal mengirim OTP. Periksa nomor HP Anda.')
        }
      } else {
        setStep('verify')
        setResendTimer(60) // 60 seconds cooldown
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp.trim() || otp.length !== 6) {
      setError('Kode OTP harus 6 digit')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formattedPhone = formatPhoneNumber(phone)
      
      const { data, error: authError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      })

      if (authError || !data.user) {
        setFailedAttempts(prev => prev + 1)
        
        if (failedAttempts >= 2) { // 3rd failed attempt
          setError('Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.')
          // In real app, implement actual lockout mechanism
          return
        }
        
        setError(`Kode OTP salah. Percobaan ${failedAttempts + 1}/3`)
        setOTP('')
      } else {
        // Success! Redirect to generate/processing page
        router.push('/generate')
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setLoading(true)
    setError('')

    try {
      const formattedPhone = formatPhoneNumber(phone)
      
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (authError) {
        setError('Gagal mengirim ulang OTP')
      } else {
        setResendTimer(60)
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/upload" className="mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Verifikasi HP</h1>
          </div>

          {/* Phone Input Form */}
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masukkan nomor HP kamu untuk lanjut
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  +62
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8123456789"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023801] focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 ${
                loading || !phone.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#023801] text-white hover:bg-[#034a01]'
              }`}
            >
              {loading ? 'Mengirim...' : 'Kirim OTP'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p>Kami akan mengirim kode verifikasi via SMS ke nomor ini.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // OTP Verification Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setStep('phone')} 
            className="mr-4"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Masukkan Kode OTP</h1>
        </div>

        {/* OTP Info */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">
            Kode OTP sudah dikirim via SMS ke
          </p>
          <p className="font-semibold text-gray-900">
            {formatPhoneNumber(phone)}
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleOTPSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl font-bold py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023801] focus:border-transparent tracking-widest"
              disabled={loading}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 ${
              loading || otp.length !== 6
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#023801] text-white hover:bg-[#034a01]'
            }`}
          >
            {loading ? 'Verifikasi...' : 'Verifikasi OTP'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              Kirim ulang dalam {resendTimer} detik
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-[#023801] font-medium hover:underline disabled:opacity-50"
            >
              Kirim ulang OTP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}