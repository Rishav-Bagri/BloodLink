import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-pink-900">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 text-center px-4">
        <div className="animate-fade-in">
          <div className="text-9xl mb-6 animate-bounce">🩸</div>
          <h1 className="text-7xl md:text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-pulse-slow">
            BloodLink
          </h1>
          <p className="text-2xl md:text-3xl text-red-100 font-bold mb-2 drop-shadow-lg">
            Life-Saving Blood Management System
          </p>
          <p className="text-lg text-red-200 mb-8">
            Connect hospitals, manage inventory, save lives
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-6 animate-fade-in">
          <button
            onClick={() => navigate("/hospital")}
            className="group relative px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-white/30 cursor-pointer transition-all transform hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] border-2 border-white/50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              🏥 For Hospital
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
          
          <button
            onClick={() => navigate("/emergency")}
            className="group relative px-10 py-5 bg-red-600/90 backdrop-blur-md text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-red-700 cursor-pointer transition-all transform hover:scale-110 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] border-2 border-red-400/50 overflow-hidden animate-pulse-slow"
          >
            <span className="relative z-10 flex items-center gap-3">
              🚨 Emergency
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20">
            <div className="text-4xl mb-3">🩸</div>
            <h3 className="text-xl font-bold text-white mb-2">Blood Inventory</h3>
            <p className="text-red-100 text-sm">Track and manage blood supply</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="text-xl font-bold text-white mb-2">Emergency Search</h3>
            <p className="text-red-100 text-sm">Find nearest blood source</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-xl font-bold text-white mb-2">Donations</h3>
            <p className="text-red-100 text-sm">Record and track donations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
