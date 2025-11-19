import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
          {/* Header with gradient */}
          <div className="px-8 py-10 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-bounce-in">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" style={{ fontSize: '28px', fontWeight: 600 }}>
              Form Berhasil Dikirim!
            </h1>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700" style={{ fontSize: '18px', lineHeight: '28px' }}>
                Terima kasih telah meluangkan waktu untuk mengisi formulir ini.
              </p>
              <p className="text-gray-600" style={{ fontSize: '16px', lineHeight: '24px' }}>
                Data Anda telah diterima dan akan segera diproses.
              </p>

              {/* Success Icon Animation */}
              <div className="flex justify-center mt-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center animate-pulse">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20"></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
                  style={{ fontSize: '16px' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500" style={{ fontSize: '13px', lineHeight: '18px' }}>
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Data Anda aman dan terlindungi
          </p>
        </div>
      </div>
    </div>
  );
}

