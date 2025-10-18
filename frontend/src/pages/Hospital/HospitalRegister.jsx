import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function HospitalUpdate() {
  const [hospitalData, setHospitalData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contact: "",
    latitude: "",
    longitude: ""
  })

  const handleChange = (e) => {
    setHospitalData({ ...hospitalData, [e.target.name]: e.target.value })
  }
  const navigate=useNavigate()
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const hospitalId = localStorage.getItem("logged")
      if (!hospitalId) throw new Error("Hospital not logged in")

      // send data to backend
      const res = await fetch(`http://localhost:3000/api/v1/hospitals/update/${hospitalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            loggedId:hospitalId,
          // send empty string as placeholder, backend can handle defaults
          hospitalData: {
            ...hospitalData,
            latitude: parseFloat(hospitalData.latitude) || 0,
            longitude: parseFloat(hospitalData.longitude) || 0
        }
        })
      })

      if (!res.ok) throw new Error("Failed to update hospital")
      const data = await res.json()
      alert("Hospital details updated successfully!")
      console.log(data)
      navigate("/hospital/dashboard")
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-4">Update Hospital Details</h2>

          <input
            type="text"
            name="name"
            placeholder="Hospital Name"
            value={hospitalData.name}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={hospitalData.address}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={hospitalData.city}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={hospitalData.state}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={hospitalData.pincode}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={hospitalData.contact}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={hospitalData.latitude}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={hospitalData.longitude}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
          >
            Update Hospital
          </button>
        </form>
      </div>
    </div>
  )
}
