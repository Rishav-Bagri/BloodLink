import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Inventory from "../../Components/Inventory"
import StatsCard from "../../Components/StatsCard"
import Toast from "../../Components/Toast"

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)

  const hospitalId = localStorage.getItem("hospitalId")

  useEffect(() => {
    if (hospitalId) {
      fetchStats()
    }
  }, [hospitalId])

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/hospitals/stats/${hospitalId}`)
      if (!res.ok) throw new Error("Failed to fetch stats")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setStatsLoading(false)
    }
  }

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/users/search?name=${searchTerm}&contact=${searchTerm}&email=${searchTerm}`
      )
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()

      if (data.length === 0) {
        showToast("No users found", "warning")
        return
      }

      if (data.length === 1) {
        navigate("/donate", { state: { user: data[0] } })
        showToast("User found! Redirecting...", "success")
      } else {
        setSearchResults(data)
      }
    } catch (err) {
      console.error(err)
      showToast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user) => {
    setSearchResults([])
    setSearchTerm(user.name)
    navigate("/donate", { state: { user } })
    showToast(`Selected ${user.name}`, "success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-gray-800 mb-2 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          Hospital Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Manage your blood bank operations</p>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Inventory"
            value={stats.inventory.total}
            icon="🩸"
            color="red"
            subtitle={`${stats.inventory.batches} batches`}
          />
          <StatsCard
            title="Pending Requests"
            value={stats.requests.pending}
            icon="⏳"
            color="yellow"
            subtitle={stats.requests.emergency > 0 ? `${stats.requests.emergency} emergency` : "All clear"}
          />
          <StatsCard
            title="Total Donations"
            value={stats.donations.total}
            icon="❤️"
            color="green"
            subtitle={`${stats.donations.totalUnits} units`}
          />
          <StatsCard
            title="Fulfilled Requests"
            value={stats.requests.fulfilled}
            icon="✅"
            color="blue"
            subtitle={`${stats.recent.requests} this week`}
          />
        </div>
      )}

      {/* Alerts */}
      {stats && (stats.inventory.expired > 0 || stats.inventory.expiringSoon > 0 || stats.requests.emergency > 0) && (
        <div className="mb-8 space-y-3">
          {stats.inventory.expired > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-red-800">Expired Blood Detected</p>
                <p className="text-sm text-red-600">{stats.inventory.expired} batches have expired. Please remove them.</p>
              </div>
            </div>
          )}
          {stats.inventory.expiringSoon > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-bold text-yellow-800">Blood Expiring Soon</p>
                <p className="text-sm text-yellow-600">{stats.inventory.expiringSoon} batches expiring within 7 days.</p>
              </div>
            </div>
          )}
          {stats.requests.emergency > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in animate-pulse-slow">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-bold text-red-800">Emergency Requests</p>
                <p className="text-sm text-red-600">{stats.requests.emergency} emergency blood request(s) pending!</p>
              </div>
              <button
                onClick={() => navigate("/receive")}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
              >
                View Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Emergency Blood Search */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-red-400"
          onClick={() => navigate("/emergency")}>
          <div className="text-4xl mb-3">🚨</div>
          <h2 className="text-xl font-bold mb-2">Emergency Search</h2>
          <p className="text-red-100 text-sm mb-4">Find nearest hospital with blood</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center font-semibold hover:bg-white/30 transition">
            Search Now →
          </div>
        </div>

        {/* Receive Blood */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-blue-400"
          onClick={() => navigate("/receive")}>
          <div className="text-4xl mb-3">🩸</div>
          <h2 className="text-xl font-bold mb-2">Receive Blood</h2>
          <p className="text-blue-100 text-sm mb-4">Record blood given to patients</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center font-semibold hover:bg-white/30 transition">
            Record →
          </div>
        </div>

        {/* Add Donor */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-green-400"
          onClick={() => navigate("/user/create")}>
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-xl font-bold mb-2">Add Donor</h2>
          <p className="text-green-100 text-sm mb-4">Register new user</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center font-semibold hover:bg-white/30 transition">
            Add User →
          </div>
        </div>

        {/* Add Donation */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-purple-400">
          <div className="text-4xl mb-3">❤️</div>
          <h2 className="text-xl font-bold mb-2">Add Donation</h2>
          <p className="text-purple-100 text-sm mb-4">Record blood donation</p>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:border-white/50 mb-2"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`w-full bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-center font-semibold hover:bg-white/40 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Searching..." : "Search →"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Search Results ({searchResults.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.contact}</p>
                    {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                      {user.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
        <Inventory />
      </div>
    </div>
  )
}

export default HospitalDashboard
