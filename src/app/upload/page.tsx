'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const router = useRouter()

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        
        // Cache image in localStorage
        localStorage.setItem('socai_cached_image', result)
        localStorage.setItem('socai_cached_image_name', file.name)
        localStorage.setItem('socai_cached_image_type', file.type)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleGenerate = () => {
    if (selectedImage) {
      // Navigate to OTP login page
      router.push('/otp')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Upload Foto</h1>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
              isDragOver 
                ? 'border-[#023801] bg-green-50' 
                : imagePreview 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <div className="mx-auto max-h-48 rounded-lg shadow-md overflow-hidden relative">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={300}
                    height={200}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Foto siap diproses
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedImage?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    localStorage.removeItem('socai_cached_image')
                    localStorage.removeItem('socai_cached_image_name')
                    localStorage.removeItem('socai_cached_image_type')
                  }}
                  className="text-sm text-gray-500 underline"
                >
                  Ganti foto
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    Drag & drop foto atau
                  </p>
                  <label className="text-[#023801] font-semibold cursor-pointer underline">
                    pilih dari galeri
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG, WEBP (maks. 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={handleGenerate}
            disabled={!selectedImage}
            className={`w-full font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg ${
              selectedImage
                ? 'bg-[#023801] text-white hover:bg-[#034a01]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Generate Now
          </button>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Tips untuk hasil terbaik:</p>
              <ul className="text-xs space-y-1 text-blue-600">
                <li>• Gunakan foto dengan wajah yang jelas</li>
                <li>• Hindari foto yang terlalu gelap/terang</li>
                <li>• Resolusi minimal 512x512 pixel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}