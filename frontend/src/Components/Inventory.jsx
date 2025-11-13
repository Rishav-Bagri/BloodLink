import { useState, useEffect } from "react"

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [groupedInventory, setGroupedInventory] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const hospitalId = localStorage.getItem("hospitalId")

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/inventory/hospital/${hospitalId}`)
        if (!res.ok) throw new Error("Failed to fetch inventory")
        const data = await res.json()
        setInventory(data)
        
        // Group by blood group
        const grouped = data.reduce((acc, item) => {
          const group = item.bloodGroup
          if (!acc[group]) {
            acc[group] = []
          }
          acc[group].push(item)
          return acc
        }, {})
        
        // Calculate totals for each group
        Object.keys(grouped).forEach(group => {
          grouped[group].total = grouped[group].reduce((sum, item) => sum + item.quantity, 0)
          grouped[group].expiringSoon = grouped[group].filter(item => {
            const expiryDate = new Date(item.expiryDate)
            const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24)
            return daysUntilExpiry <= 7 && daysUntilExpiry > 0
          }).length
        })
        
        setGroupedInventory(grouped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (hospitalId) fetchInventory()
  }, [hospitalId])

  const getExpiryStatus = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24)
    
    if (daysUntilExpiry < 0) return { status: "expired", color: "bg-red-100 text-red-800 border-red-300" }
    if (daysUntilExpiry <= 7) return { status: "expiring", color: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    return { status: "good", color: "bg-green-100 text-green-800 border-green-300" }
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-800">Blood Inventory</h1>
        <div className="text-sm text-gray-500">
          Total Batches: <span className="font-bold text-gray-800">{inventory.length}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {bloodGroups.map((group) => {
          const groupData = groupedInventory[group] || []
          const total = groupData.total || 0
          const expiringCount = groupData.expiringSoon || 0
          
          return (
            <div
              key={group}
              onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
              className={`bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 ${
                selectedGroup === group ? "border-red-500" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-800">{group}</span>
                {expiringCount > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ⚠ {expiringCount}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-red-600">{total}</div>
              <div className="text-xs text-gray-500 mt-1">units available</div>
            </div>
          )
        })}
      </div>

      {/* Detailed View */}
      {selectedGroup && groupedInventory[selectedGroup] && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedGroup} - Detailed Inventory
            </h2>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedInventory[selectedGroup].map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {item.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-800">{item.quantity}</span>
                        <span className="text-sm text-gray-500 ml-1">units</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${expiryStatus.color}`}>
                          {expiryStatus.status === "expired" ? "⚠️ Expired" : 
                           expiryStatus.status === "expiring" ? "⏰ Expiring Soon" : 
                           "✓ Good"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Inventory Table */}
      {!selectedGroup && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <div className="text-4xl mb-2">🩸</div>
                      <p className="text-lg">No inventory available</p>
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate)
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-red-600">{item.bloodGroup}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-gray-800">{item.quantity}</span>
                          <span className="text-sm text-gray-500 ml-1">units</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(item.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${expiryStatus.color}`}>
                            {expiryStatus.status === "expired" ? "⚠️ Expired" : 
                             expiryStatus.status === "expiring" ? "⏰ Expiring Soon" : 
                             "✓ Good"}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory
