import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function HospitalList() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate() // for navigation

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/hospitals")
        if (!res.ok) throw new Error("Failed to fetch hospitals")
        const data = await res.json()
        setHospitals(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  if (loading) return <p className="text-center text-lg mt-10">Loading hospitals...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-semibold mb-6">Hospital List</h1>
      {hospitals.length === 0 ? (
        <p>No hospitals found</p>
      ) : (
        <table className="border-collapse border border-gray-400 w-3/4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">City</th>
              <th className="border border-gray-400 px-4 py-2">State</th>
              <th className="border border-gray-400 px-4 py-2">Contact</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr
                key={hospital.id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/hospital/${hospital.id}`)}
              >
                <td className="border border-gray-400 px-4 py-2 text-center">{hospital.name}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{hospital.city}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{hospital.state}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{hospital.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default HospitalList
