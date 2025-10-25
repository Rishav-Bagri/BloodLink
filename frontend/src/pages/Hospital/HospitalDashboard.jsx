import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Inventory from "../../Components/Inventory"

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setLoading(true)
    setSelectedUser(null)
    try {
      // query backend by name, contact, or email
      const res = await fetch(
        `http://localhost:3000/api/v1/users/search?name=${searchTerm}&contact=${searchTerm}&email=${searchTerm}`
      )
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setSearchResults([])
    setSearchTerm(user.name)
    // navigate immediately to donation page with user details
    navigate("/donate", { 
        state: { 
            user: selectedUser, 
            hospital: hospitalInfo // Pass the hospital object here
        } 
    });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Hospital Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Start a camp */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-2">Start a Blood Donation Camp</h2>
          <div
            onClick={() => navigate("/camps/create")}
            className="text-blue-600 cursor-pointer underline mt-2 self-start"
          >
            Create Camp
          </div>
        </div>

        {/* Add a donor */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-2">Add a Donor</h2>
          <div
            onClick={() => navigate("/user/create")}
            className="text-blue-600 cursor-pointer underline mt-2 self-start"
          >
            Add User
          </div>
        </div>

        {/* Add a donation */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Add a Donation</h2>

          <input
            type="text"
            placeholder="Search user by name, contact, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`p-2 rounded-md mb-2 text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {searchResults.length > 0 && (
            <ul className="border rounded-md max-h-40 overflow-y-auto mb-2 bg-white shadow-sm">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  {user.name} - {user.contact} - {user.email} ({user.bloodGroup})
                </li>
              ))}
            </ul>
          )}

          {selectedUser && (
            <div className="p-2 mb-2 border rounded bg-green-50 text-green-800">
              Selected User: {selectedUser.name} - {selectedUser.contact} ({selectedUser.bloodGroup})
            </div>
          )}
        </div>
      </div>

      {/* Inventory Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <Inventory />
      </div>
    </div>
  )
}

export default HospitalDashboard
