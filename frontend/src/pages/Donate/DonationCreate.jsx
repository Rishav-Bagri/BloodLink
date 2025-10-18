import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const DonationCreate = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Receive user and hospital/camp info via state from previous page
  const { user, hospital, camp } = location.state || {}

  const [donorName, setDonorName] = useState(user?.name || "")
  const [donorContact, setDonorContact] = useState(user?.contact || "")
  const [donorEmail, setDonorEmail] = useState(user?.email || "")
  const [unitsDonated, setUnitsDonated] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)) // default today

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDonation = {
      donorId: user?.id,
      hospitalId: hospital?.id,
      campId: camp?.id || null,
      date,
      unitsDonated: parseInt(unitsDonated),
    }

    console.log("Logging Donation:", newDonation)

    // TODO: call backend API to create donation event
    // after success:
    // navigate("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Log Blood Donation</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Donor Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Donor Name</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Donor Contact */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Contact Number</label>
            <input
              type="text"
              value={donorContact}
              onChange={(e) => setDonorContact(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Donor Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Hospital (read-only) */}
          {hospital && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Hospital</label>
              <input
                type="text"
                value={hospital.name}
                readOnly
                className="w-full border px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          {/* Camp (read-only, optional) */}
          {camp && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Camp</label>
              <input
                type="text"
                value={camp.name}
                readOnly
                className="w-full border px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Donation Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Units Donated */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Units Donated</label>
            <input
              type="number"
              min="1"
              value={unitsDonated}
              onChange={(e) => setUnitsDonated(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
          >
            Log Donation
          </button>
        </form>
      </div>
    </div>
  )
}

export default DonationCreate
