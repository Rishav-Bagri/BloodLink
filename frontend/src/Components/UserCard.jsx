import { useState, useEffect } from "react"

const UserCard = () => {
  // mock user data
  const [user] = useState({
    name: "John Doe",
    dateOfBirth: new Date("1990-05-12"),
    gender: "Male",
    contact: "9876543210",
    email: "john.doe@example.com",
    bloodGroup: "A+",
    userType: "Donor",
    lastDonation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    isEligible: true,
    weight: 70,
    hemoglobin: 14.2,
    hospital: { name: "City Hospital" },
  })

  const logged= localStorage["logged"]||1

  const handleDonate = () => {
    console.log("Redirect to Donation Event form")
  }

  const handleReceive = () => {
    console.log("Redirect to Receive Blood form")
  }

  const handleUpdate = () => {
    console.log("Redirect to Update User Info form")
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
      <p><strong>DOB:</strong> {user.dateOfBirth.toLocaleDateString()}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Contact:</strong> {user.contact}</p>
      <p><strong>Email:</strong> {user.email || "-"}</p>
      <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
      <p><strong>User Type:</strong> {user.userType}</p>
      <p><strong>Last Donation:</strong> {user.lastDonation?.toLocaleDateString() || "-"}</p>
      <p><strong>Eligible:</strong> {user.isEligible ? "Yes" : "No"}</p>
      <p><strong>Weight:</strong> {user.weight || "-"}</p>
      <p><strong>Hemoglobin:</strong> {user.hemoglobin || "-"}</p>
      <p><strong>Hospital:</strong> {user.hospital?.name || "-"}</p>

      <div className="mt-4 flex flex-col gap-2">
        {!!logged && (
          <button
            onClick={handleDonate}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Donate Blood
          </button>
        )}
        <button
          onClick={handleReceive}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Receive Blood
        </button>
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Update Info
        </button>
      </div>
    </div>
  )
}

export default UserCard
