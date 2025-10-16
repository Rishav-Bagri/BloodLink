import { useState } from "react"

export default function HospitalForm() {
    const logged = localStorage["logged"]||0
    const [id, setId] = useState("")
    const [formData, setFormData] = useState({
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = logged
                ? `http://localhost:3000/api/v1/hospitals/update/${id}`
                : "http://localhost:3000/api/v1/hospitals/create"
            const method = logged ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude)
                })
            })

            if (!res.ok) {
                const errText = await res.text()
                throw new Error(`HTTP ${res.status}: ${errText}`)
            }

            const data = await res.json()
            alert(logged ? "Hospital updated!" : "Hospital created!")
            console.log("Response:", data)
        } catch (err) {
            console.error("Request failed:", err)
            alert("Something went wrong: " + err.message)
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {logged ? "Update Hospital" : "Create Hospital"}
                    </h2>
                </div>

                {!!logged && (
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Hospital ID for update"
                        className="mb-4 w-full border rounded-md p-2"
                    />
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Hospital Name"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Latitude"
                        required
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Longitude"
                        required
                        className="border p-2 rounded-md"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {logged ? "Update Hospital" : "Create Hospital"}
                    </button>
                </form>
            </div>
        </div>
    )
}
