import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function HospitalDetail() {
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/hospitals/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setHospital(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHospital()
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{hospital.name}</h1>
      <p><strong>Address:</strong> {hospital.address}</p>
      <p><strong>City:</strong> {hospital.city}</p>
      <p><strong>State:</strong> {hospital.state}</p>
      <p><strong>Pincode:</strong> {hospital.pincode}</p>
      <p><strong>Contact:</strong> {hospital.contact}</p>
      <p><strong>Latitude:</strong> {hospital.latitude}</p>
      <p><strong>Longitude:</strong> {hospital.longitude}</p>
      <p className="text-sm text-gray-500 mt-4">
        Created at: {new Date(hospital.createdAt).toLocaleString()} <br />
        Updated at: {new Date(hospital.updatedAt).toLocaleString()}
      </p>
    </div>
  )
}

export default HospitalDetail
