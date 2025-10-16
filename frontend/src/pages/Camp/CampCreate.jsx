import { useState } from "react"

const CampCreate = () => {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [organizer, setOrganizer] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: send POST request to your backend API
    const newCamp = {
      name,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      startDate,
      endDate,
      organizer,
    }
    console.log("New Camp:", newCamp)
    // reset form or navigate after success
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Camp</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Camp Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.000001"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="border px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="border px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Organizer Name"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Create Camp
          </button>
        </form>
      </div>
    </div>
  )
}

export default CampCreate
