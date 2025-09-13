import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Mobile-first container with max width for desktop */}
      <div className="max-w-sm mx-auto px-6 py-8 md:max-w-md">
        {/* Header with logo space */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#023801] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat! Kamu mendapatkan
          </h1>
          <div className="text-3xl font-extrabold text-[#023801] mb-1">
            50 Token Socai 🎉
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Bikin Video Viral pakai AI cuma hitungan menit!
          </p>
        </div>

        {/* Main CTA Button */}
        <div className="mb-8">
          <Link href="/upload" className="block">
            <button className="w-full bg-[#023801] text-white font-semibold py-4 px-6 rounded-xl text-lg hover:bg-[#034a01] transition-colors duration-200 shadow-lg">
              Mulai Sekarang
            </button>
          </Link>
        </div>

        {/* Features / Benefits */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Upload foto → Jadi video AI</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Proses cepat & mudah</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cocok untuk konten viral</span>
          </div>
        </div>

        {/* Token info */}
        <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Token gratis:</span> 50 (cukup untuk 2 video)
          </p>
        </div>
      </div>
    </div>
  );
}
