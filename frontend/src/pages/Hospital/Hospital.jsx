import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Toast from "../../Components/Toast"

const Hospital = () => {
  const navigate = useNavigate()
  const [showDonations, setShowDonations] = useState(false)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const hospitalId = localStorage.getItem("hospitalId")

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchRecentDonations = async () => {
    setLoading(true)
    try {
      let url = "http://localhost:3000/api/v1/donations"
      if (hospitalId) {
        // If logged in, fetch hospital-specific donations
        url = `http://localhost:3000/api/v1/donations/hospital/${hospitalId}`
      }
      
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch donations")
      const data = await res.json()
      // Sort by date (newest first) and limit to 50
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50)
      setDonations(sorted)
      setShowDonations(true)
    } catch (err) {
      console.error(err)
      showToast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Animated background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="text-8xl animate-bounce">🏥</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Hospital Portal
          </h1>
          <p className="text-gray-700 text-xl font-semibold mb-2">
            Manage your blood bank operations
          </p>
          <p className="text-gray-600 text-lg">
            Login to access your dashboard or register a new hospital
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Register Card */}
          <div 
            onClick={() => navigate("/hospital/register")}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-green-200 hover:border-green-400 animate-fade-in"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✨</div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">Register Hospital</h2>
            <p className="text-gray-600 mb-4">
              Create a new hospital account to start managing your blood bank
            </p>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-center group-hover:from-green-700 group-hover:to-emerald-700 transition">
              Register Now →
            </div>
          </div>

          {/* Login Card */}
          <div 
            onClick={() => navigate("/hospital/login")}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-blue-200 hover:border-blue-400 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔐</div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">Hospital Login</h2>
            <p className="text-gray-600 mb-4">
              Access your dashboard to manage inventory, requests, and donations
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-center group-hover:from-blue-700 group-hover:to-indigo-700 transition">
              Login Now →
            </div>
          </div>

          {/* View Donations Card */}
          <div 
            onClick={fetchRecentDonations}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-purple-200 hover:border-purple-400 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">❤️</div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">View Donations</h2>
            <p className="text-gray-600 mb-4">
              See the last 50 blood donations recorded in the system
            </p>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-center group-hover:from-purple-700 group-hover:to-pink-700 transition">
              {loading ? "Loading..." : "View Donations →"}
            </div>
          </div>
        </div>

        {/* Donations Display */}
        {showDonations && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fade-in border-2 border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">
                  ❤️ Recent Donations
                </h2>
                <p className="text-gray-600">
                  {hospitalId ? "Your hospital's" : "All"} last {donations.length} donations
                </p>
              </div>
              <button
                onClick={() => setShowDonations(false)}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition"
              >
                ✗ Close
              </button>
            </div>

            {/* Summary Stats */}
            {donations.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Total Donations</div>
                  <div className="text-3xl font-black">{donations.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Total Units</div>
                  <div className="text-3xl font-black">
                    {donations.reduce((sum, d) => sum + d.unitsDonated, 0)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Unique Donors</div>
                  <div className="text-3xl font-black">
                    {new Set(donations.map(d => d.donorId)).size}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Avg Units/Donation</div>
                  <div className="text-3xl font-black">
                    {donations.length > 0 
                      ? (donations.reduce((sum, d) => sum + d.unitsDonated, 0) / donations.length).toFixed(1)
                      : 0}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Loading donations...</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🩸</div>
                <p className="text-2xl font-bold text-gray-600 mb-2">No Donations Yet</p>
                <p className="text-gray-500">Start recording donations to see them here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-green-600 to-emerald-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Blood Group</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Units</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Hospital</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-green-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {new Date(donation.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(donation.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {donation.donor?.name || "Unknown"}
                          </div>
                          {donation.donor?.contact && (
                            <div className="text-xs text-gray-500">
                              {donation.donor.contact}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                            {donation.donor?.bloodGroup || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-black text-green-600">
                            {donation.unitsDonated}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">units</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {donation.hospital?.name || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
            <div className="text-4xl mb-3">🩸</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Blood Inventory</h3>
            <p className="text-gray-600 text-sm">Track and manage your blood supply with real-time updates</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Emergency Search</h3>
            <p className="text-gray-600 text-sm">Find nearest hospitals with available blood in emergencies</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View statistics and insights about your operations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hospital
