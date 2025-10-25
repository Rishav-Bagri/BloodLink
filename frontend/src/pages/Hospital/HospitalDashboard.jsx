import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Inventory from "../../Components/Inventory"

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Replace with actual hospital data
  const hospitalInfo = {
    id: "hosp123",
    name: "City Blood Center",
    address: "Dehradun",
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

      // If single match → navigate directly
      if (data.length === 1) {
        navigate("/donate", { state: { user: data[0], hospital: hospitalInfo } })
      } else {
        setSearchResults(data)
      }
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user) => {
    setSearchResults([])
    setSearchTerm(user.name)
    navigate("/donate", { state: { user, hospital: hospitalInfo } })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
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
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col relative">
          <h2 className="text-xl font-semibold mb-2">Add a Donation</h2>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search user by name, contact, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`p-2 w-full rounded-md text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay dropdown (absolute to viewport) */}
      {searchResults.length > 0 && (
        <div
          className="absolute z-50 bg-white border rounded-lg shadow-xl max-h-64 overflow-y-auto"
          style={{
            top: inputRef.current
              ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 5
              : 0,
            left: inputRef.current
              ? inputRef.current.getBoundingClientRect().left + window.scrollX
              : 0,
            width: inputRef.current ? inputRef.current.offsetWidth : "auto",
          }}
        >
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              {user.name} - {user.contact} - {user.email} ({user.bloodGroup})
            </div>
          ))}
        </div>
      )}

      {/* Inventory Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <Inventory />
      </div>
    </div>
  )
}

export default HospitalDashboard
