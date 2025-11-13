import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Toast from "../../Components/Toast"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function EmergencySearch() {
  const navigate = useNavigate()
  const [bloodGroup, setBloodGroup] = useState("")
  const [unitsRequired, setUnitsRequired] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [toast, setToast] = useState(null)

  const hospitalId = localStorage.getItem("hospitalId")

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!hospitalId) {
      setError("Please login as a hospital first")
      setTimeout(() => navigate("/hospital/login"), 2000)
      return
    }

    if (!bloodGroup || !unitsRequired) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("http://localhost:3000/api/v1/hospitals/emergency/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          bloodGroup,
          unitsRequired: parseInt(unitsRequired)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Search failed")
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-12 px-4 relative overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-8xl animate-pulse">🚨</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
            Emergency Blood Search
          </h1>
          <p className="text-gray-700 text-xl font-semibold">
            Find the nearest hospital with available blood supply
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Real-time distance calculation</span>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white/50 animate-fade-in">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                🩸 Blood Group Required
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border-3 border-gray-300 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition"
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                📊 Units Required
              </label>
              <input
                type="number"
                min="1"
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(e.target.value)}
                placeholder="Enter number of units needed"
                className="w-full border-3 border-gray-300 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-fade-in">
                <p className="font-bold flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-xl font-black text-white text-xl transition-all transform shadow-2xl ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 hover:scale-105 hover:shadow-3xl active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Searching...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🔍 Search for Blood
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Current Hospital Status */}
            {!result.hasEnough && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl p-6 shadow-xl animate-fade-in">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-yellow-900 mb-3">
                      Insufficient Blood in Your Hospital
                    </h3>
                    <div className="bg-white/80 rounded-xl p-4 space-y-2">
                      <p className="text-lg text-yellow-800">
                        Current available: <span className="font-black text-2xl text-red-600">{result.currentQuantity} units</span>
                      </p>
                      <p className="text-lg text-yellow-800">
                        Required: <span className="font-black text-2xl text-orange-600">{unitsRequired} units</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success - Has Enough */}
            {result.hasEnough && result.hospital && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 shadow-2xl text-white animate-fade-in transform hover:scale-105 transition">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl animate-bounce">✅</span>
                  <div>
                    <h3 className="text-3xl font-black mb-2">
                      Blood Available in Your Hospital!
                    </h3>
                    <p className="text-green-100 text-lg">You have sufficient supply</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 space-y-3 border-2 border-white/30">
                  <p className="text-xl font-bold">
                    <span className="opacity-80">Hospital:</span> {result.hospital.name}
                  </p>
                  <p className="text-lg">
                    <span className="opacity-80">📍</span> {result.hospital.address}, {result.hospital.city}, {result.hospital.state}
                  </p>
                  <p className="text-lg">
                    <span className="opacity-80">📞</span> {result.hospital.contact}
                  </p>
                  <div className="mt-4 pt-4 border-t-2 border-white/30">
                    <p className="text-3xl font-black">
                      Available: {result.hospital.availableQuantity} units
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nearest Hospital Found */}
            {!result.hasEnough && result.nearestHospital && (
              <div className="bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 rounded-2xl p-8 shadow-2xl text-white animate-fade-in transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-black mb-2">
                      🏥 Nearest Hospital Found
                    </h3>
                    <p className="text-red-100">Blood supply available nearby</p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-white/50">
                    <span className="text-2xl font-black">{result.nearestHospital.distance} km</span>
                    <p className="text-xs text-center mt-1 opacity-80">Distance</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 space-y-4 border-2 border-white/30">
                  <h4 className="text-3xl font-black">{result.nearestHospital.name}</h4>
                  
                  <div className="space-y-2 text-lg">
                    <p className="flex items-center gap-2">
                      <span>📍</span> {result.nearestHospital.address}, {result.nearestHospital.city}, {result.nearestHospital.state}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📞</span> {result.nearestHospital.contact}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-white/30">
                    <p className="text-2xl font-black">
                      Available: {result.nearestHospital.availableQuantity} units
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* All Available Hospitals */}
            {!result.hasEnough && result.allAvailableHospitals && result.allAvailableHospitals.length > 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-gray-200 animate-fade-in">
                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                  <span>📋</span> All Available Hospitals
                  <span className="text-sm font-normal text-gray-500">(Sorted by Distance)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.allAvailableHospitals.map((hospital, index) => (
                    <div
                      key={hospital.id}
                      className={`border-2 rounded-xl p-5 transition-all hover:shadow-xl transform hover:scale-105 ${
                        index === 0
                          ? "border-red-500 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-xl text-gray-800">{hospital.name}</h4>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          index === 0 
                            ? "bg-red-600 text-white" 
                            : "bg-blue-600 text-white"
                        }`}>
                          {hospital.distance} km
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {hospital.address}, {hospital.city}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">📞 {hospital.contact}</p>
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-lg font-black text-green-700">
                          Available: {hospital.availableQuantity} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!result.hasEnough && !result.nearestHospital && (
              <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 rounded-2xl p-8 shadow-xl animate-fade-in">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">❌</span>
                  <h3 className="text-2xl font-black text-red-800 mb-3">
                    No Blood Supply Found
                  </h3>
                  <p className="text-red-700 text-lg">
                    {result.message || "Unfortunately, no hospitals have sufficient blood supply at this time."}
                  </p>
                </div>
              </div>
            )}

            {/* Reset Button */}
            {result && (
              <button
                onClick={() => {
                  setResult(null)
                  setBloodGroup("")
                  setUnitsRequired("")
                  setError("")
                }}
                className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-black text-lg hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-xl"
              >
                🔄 New Search
              </button>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/hospital/dashboard")}
            className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

