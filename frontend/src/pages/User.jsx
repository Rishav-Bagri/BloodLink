// pages/Users.jsx
import React, { useState } from "react"

export default function Users() {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    email: "",
    bloodGroup: "",
    userType: "DONOR",
  })

  const [message, setMessage] = useState("")

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3000/api/v1/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error creating user")
      setMessage("User created successfully!")
      setFormData({
        name: "",
        dateOfBirth: "",
        gender: "",
        contact: "",
        email: "",
        bloodGroup: "",
        userType: "DONOR",
      })
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create User</h1>
        {message && <p className="text-center mb-4">{message}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="DONOR">Donor</option>
            <option value="PATIENT">Patient</option>
            <option value="STAFF">Staff</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  )
}
