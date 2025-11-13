import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Toast from "../../Components/Toast"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function ReceiveBlood() {
  const navigate = useNavigate()
  const hospitalId = localStorage.getItem("hospitalId")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState(null)
  const [availableInventory, setAvailableInventory] = useState({})
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    bloodGroup: "",
    unitsRequired: ""
  })

  useEffect(() => {
    if (!hospitalId) {
      setError("Please login as a hospital first")
      setTimeout(() => navigate("/hospital/login"), 2000)
      return
    }
    fetchAvailableInventory()
    fetchUsers()
  }, [hospitalId])

  const fetchUsers = async () => {
    try {
      // Fetch all users (not just hospital-specific) so we can search across all
      const res = await fetch(`http://localhost:3000/api/v1/users/all`)
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
      showToast("Failed to load users", "error")
    }
  }

  const fetchAvailableInventory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/inventory/hospital/${hospitalId}`)
      if (!res.ok) throw new Error("Failed to fetch inventory")
      const data = await res.json()
      
      // Group by blood group and calculate totals (only non-expired)
      const now = new Date()
      const grouped = data
        .filter(item => new Date(item.expiryDate) > now)
        .reduce((acc, item) => {
          if (!acc[item.bloodGroup]) {
            acc[item.bloodGroup] = 0
          }
          acc[item.bloodGroup] += item.quantity
          return acc
        }, {})
      
      setAvailableInventory(grouped)
    } catch (err) {
      console.error(err)
    }
  }

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredUsers = searchTerm.trim() 
    ? users.filter(user => {
        const searchLower = searchTerm.toLowerCase().trim()
        return (
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.contact && user.contact.includes(searchTerm.trim())) ||
          (user.bloodGroup && user.bloodGroup.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower))
        )
      })
    : []

  const handleReceive = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.userId || !formData.bloodGroup || !formData.unitsRequired) {
      setError("Please fill in all fields")
      showToast("Please fill in all fields", "error")
      return
    }

    const units = parseInt(formData.unitsRequired)
    if (units <= 0) {
      setError("Units must be greater than 0")
      showToast("Units must be greater than 0", "error")
      return
    }

    // Check available inventory
    const available = availableInventory[formData.bloodGroup] || 0
    if (available < units) {
      setError(`Insufficient blood! Only ${available} units available for ${formData.bloodGroup}`)
      showToast(`Only ${available} units available for ${formData.bloodGroup}`, "error")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/v1/inventory/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          bloodGroup: formData.bloodGroup,
          unitsRequired: units
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to receive blood")
      }

      const selectedUser = users.find(u => u.id === formData.userId)
      showToast(`Successfully gave ${units} units of ${formData.bloodGroup} to ${selectedUser?.name || "patient"}`, "success")
      setFormData({ userId: "", bloodGroup: "", unitsRequired: "" })
      setSearchTerm("")
      fetchAvailableInventory() // Refresh inventory
    } catch (err) {
      console.error(err)
      setError(err.message)
      showToast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 relative overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Animated background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="text-8xl">🩸</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Receive Blood
          </h1>
          <p className="text-gray-700 text-lg font-semibold">
            Record blood given to patients - directly deducts from inventory
          </p>
        </div>

        {/* Available Inventory Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-200 animate-fade-in">
          <h2 className="text-2xl font-black text-gray-800 mb-4">📊 Available Inventory</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodGroups.map((group) => {
              const available = availableInventory[group] || 0
              return (
                <div
                  key={group}
                  className={`p-4 rounded-xl border-2 ${
                    available > 0
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-600 mb-1">{group}</div>
                  <div className={`text-2xl font-black ${
                    available > 0 ? "text-green-600" : "text-gray-400"
                  }`}>
                    {available}
                  </div>
                  <div className="text-xs text-gray-500">units</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Receive Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border-2 border-white/50 animate-fade-in">
          <h2 className="text-3xl font-black text-gray-800 mb-6">Record Blood Receipt</h2>
          <form onSubmit={handleReceive} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                👤 Give Blood To
              </label>
              <input
                type="text"
                placeholder="Search patient by name, contact, email, or blood group"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setError("")
                }}
                className="w-full border-3 border-gray-300 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 bg-white shadow-md hover:shadow-lg transition"
              />
              {searchTerm.trim() && filteredUsers.length > 0 && (
                <div className="mt-2 border-2 border-gray-200 rounded-xl max-h-64 overflow-y-auto bg-white shadow-lg z-10">
                  {filteredUsers.slice(0, 10).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setFormData({ ...formData, userId: user.id })
                        setSearchTerm(user.name)
                      }}
                      className={`p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition ${
                        formData.userId === user.id ? "bg-blue-100 border-blue-300" : ""
                      }`}
                    >
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.contact} • <span className="font-semibold text-red-600">{user.bloodGroup}</span>
                        {user.email && ` • ${user.email}`}
                      </p>
                    </div>
                  ))}
                  {filteredUsers.length > 10 && (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Showing first 10 of {filteredUsers.length} results
                    </div>
                  )}
                </div>
              )}
              {searchTerm.trim() && filteredUsers.length === 0 && users.length > 0 && (
                <div className="mt-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    No users found matching "{searchTerm}". Try a different search term.
                  </p>
                </div>
              )}
              {users.length === 0 && (
                <div className="mt-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-600">
                    No users available. Please add users first.
                  </p>
                </div>
              )}
              {formData.userId && (
                <p className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-2">
                  <span>✓</span> Selected: <span className="font-bold">{users.find(u => u.id === formData.userId)?.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                🩸 Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => {
                  setFormData({ ...formData, bloodGroup: e.target.value })
                  setError("")
                }}
                className="w-full border-3 border-gray-300 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 bg-white shadow-md hover:shadow-lg transition"
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => {
                  const available = availableInventory[group] || 0
                  return (
                    <option key={group} value={group} disabled={available === 0}>
                      {group} {available === 0 ? "(Out of Stock)" : `(${available} units available)`}
                    </option>
                  )
                })}
              </select>
              {formData.bloodGroup && availableInventory[formData.bloodGroup] !== undefined && (
                <p className={`mt-2 text-sm font-semibold ${
                  availableInventory[formData.bloodGroup] > 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {availableInventory[formData.bloodGroup] > 0
                    ? `✓ ${availableInventory[formData.bloodGroup]} units available`
                    : "✗ No units available"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                📊 Units to Receive
              </label>
              <input
                type="number"
                min="1"
                value={formData.unitsRequired}
                onChange={(e) => {
                  setFormData({ ...formData, unitsRequired: e.target.value })
                  setError("")
                }}
                placeholder="Enter number of units"
                className="w-full border-3 border-gray-300 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 bg-white shadow-md hover:shadow-lg transition"
                required
              />
              {formData.bloodGroup && formData.unitsRequired && availableInventory[formData.bloodGroup] !== undefined && (
                <div className="mt-2">
                  {parseInt(formData.unitsRequired) > availableInventory[formData.bloodGroup] ? (
                    <p className="text-red-600 font-bold">
                      ⚠️ Insufficient! Only {availableInventory[formData.bloodGroup]} units available
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold">
                      ✓ {availableInventory[formData.bloodGroup] - parseInt(formData.unitsRequired)} units will remain
                    </p>
                  )}
                </div>
              )}
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
              disabled={loading || !formData.userId || !formData.bloodGroup || !formData.unitsRequired}
              className={`w-full py-5 rounded-xl font-black text-white text-xl transition-all transform shadow-2xl ${
                loading || !formData.userId || !formData.bloodGroup || !formData.unitsRequired
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-3xl active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✓ Receive Blood
                </span>
              )}
            </button>
          </form>
        </div>

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
