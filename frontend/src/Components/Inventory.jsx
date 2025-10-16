import { useState } from "react"

const Inventory = () => {
  // mock inventory data for a single hospital
  const [inventory] = useState([
    { id: "1", bloodGroup: "A+", quantity: 12, expiryDate: new Date(Date.now() + 10*24*60*60*1000), donation: { name: "Donation-001" }, minQuantity: 5 },
    { id: "2", bloodGroup: "A-", quantity: 6, expiryDate: new Date(Date.now() + 7*24*60*60*1000), donation: { name: "Donation-002" }, minQuantity: 3 },
    { id: "3", bloodGroup: "B+", quantity: 8, expiryDate: new Date(Date.now() + 14*24*60*60*1000), donation: { name: "Donation-003" }, minQuantity: 4 },
    { id: "4", bloodGroup: "B-", quantity: 4, expiryDate: new Date(Date.now() + 5*24*60*60*1000), donation: { name: "Donation-004" }, minQuantity: 2 },
    { id: "5", bloodGroup: "O+", quantity: 15, expiryDate: new Date(Date.now() + 12*24*60*60*1000), donation: { name: "Donation-005" }, minQuantity: 6 },
    { id: "6", bloodGroup: "O-", quantity: 5, expiryDate: new Date(Date.now() + 6*24*60*60*1000), donation: { name: "Donation-006" }, minQuantity: 3 },
    { id: "7", bloodGroup: "AB+", quantity: 3, expiryDate: new Date(Date.now() + 8*24*60*60*1000), donation: { name: "Donation-007" }, minQuantity: 2 },
    { id: "8", bloodGroup: "AB-", quantity: 2, expiryDate: new Date(Date.now() + 4*24*60*60*1000), donation: { name: "Donation-008" }, minQuantity: 1 },
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hospital Blood Inventory</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Blood Group</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Expiry Date</th>
              <th className="px-4 py-2 border">Donation Event</th>
              <th className="px-4 py-2 border">Min Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="px-4 py-2 border">{item.bloodGroup}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">{item.expiryDate.toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{item.donation.name}</td>
                <td className="px-4 py-2 border">{item.minQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory
