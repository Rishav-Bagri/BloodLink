import { useState } from "react"

const DonationCreate = () => {
  const [donorName, setDonorName] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [campName, setCampName] = useState("")
  const [date, setDate] = useState("")
  const [unitsDonated, setUnitsDonated] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call backend API to create donation event
    const newDonation = {
      donor: { name: donorName },
      hospital: hospitalName ? { name: hospitalName } : null,
      camp: campName ? { name: campName } : null,
      date,
      unitsDonated: parseInt(unitsDonated),
    }
    console.log("New Donation:", newDonation)
    // reset form or navigate after success
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Log Donation</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Donor Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            placeholder="Hospital Name (optional)"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Camp Name (optional)"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            placeholder="Donation Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            min="1"
            placeholder="Units Donated"
            value={unitsDonated}
            onChange={(e) => setUnitsDonated(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Log Donation
          </button>
        </form>
      </div>
    </div>
  )
}

export default DonationCreate
