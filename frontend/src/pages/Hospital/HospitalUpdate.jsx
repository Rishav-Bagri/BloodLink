import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaHospital, FaMapMarkerAlt, FaCity, FaGlobeAsia, FaPhone, FaMapPin, FaSave, FaArrowLeft } from "react-icons/fa"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch current hospital data
    const fetchHospitalData = async () => {
      try {
        const hospitalId = localStorage.getItem("hospitalId")
        if (!hospitalId) throw new Error("Hospital not logged in")
        
        const res = await fetch(`http://localhost:3000/api/v1/hospitals/${hospitalId}`)
        if (!res.ok) throw new Error("Failed to fetch hospital data")
        
        const data = await res.json()
        setHospitalData({
          name: data.hospital?.name || "",
          address: data.hospital?.address || "",
          city: data.hospital?.city || "",
          state: data.hospital?.state || "",
          pincode: data.hospital?.pincode || "",
          contact: data.hospital?.contact || "",
          latitude: data.hospital?.location?.coordinates?.[1] || "",
          longitude: data.hospital?.location?.coordinates?.[0] || ""
        })
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    }
    
    fetchHospitalData()
  }, [])

  const handleChange = (e) => {
    setHospitalData({ ...hospitalData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const hospitalId = localStorage.getItem("hospitalId")
      if (!hospitalId) throw new Error("Hospital not logged in")

      const res = await fetch(`http://localhost:3000/api/v1/hospitals/update/${hospitalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loggedId: hospitalId,
          hospitalData: {
            ...hospitalData,
            latitude: parseFloat(hospitalData.latitude) || 0,
            longitude: parseFloat(hospitalData.longitude) || 0
          }
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update hospital")
      }
      
      navigate("/hospital/dashboard")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const InputField = ({ name, label, icon: Icon, type = "text", placeholder }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={hospitalData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Update Hospital Profile</h1>
                <p className="mt-2 text-red-100">Update your hospital's information and contact details</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="name"
                  label="Hospital Name"
                  icon={FaHospital}
                  placeholder="Enter hospital name"
                />
                
                <InputField
                  name="contact"
                  label="Contact Number"
                  icon={FaPhone}
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                />
                
                <div className="md:col-span-2">
                  <InputField
                    name="address"
                    label="Full Address"
                    icon={FaMapMarkerAlt}
                    placeholder="Street address, area, or landmark"
                  />
                </div>
                
                <InputField
                  name="city"
                  label="City"
                  icon={FaCity}
                  placeholder="Enter city"
                />
                
                <InputField
                  name="state"
                  label="State/Province"
                  icon={FaGlobeAsia}
                  placeholder="Enter state"
                />
                
                <InputField
                  name="pincode"
                  label="Pincode"
                  icon={FaMapPin}
                  type="number"
                  placeholder="6-digit pincode"
                />
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="latitude"
                    label="Latitude"
                    icon={FaMapMarkerAlt}
                    type="number"
                    step="any"
                    placeholder="e.g., 28.6139"
                  />
                  
                  <InputField
                    name="longitude"
                    label="Longitude"
                    icon={FaMapMarkerAlt}
                    type="number"
                    step="any"
                    placeholder="e.g., 77.2090"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team at support@bloodlink.com</p>
        </div>
      </div>
    </div>
  )
}
