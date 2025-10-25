import { useState, useEffect } from "react"

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const hospitalId = localStorage.getItem("hospitalId") // hospital logged-in id

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log("hi")
        const res = await fetch(`http://localhost:3000/api/v1/inventory/hospital/${hospitalId}`)
        if (!res.ok) throw new Error("Failed to fetch inventory")
        const data = await res.json()
        setInventory(data)
      } catch (err) {
        console.error(err)
        alert(err.message)
      }
    }

    if (hospitalId) fetchInventory()
  }, [hospitalId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hospital Blood Inventory</h1>
      {console.log(inventory)}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Blood Group</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="px-4 py-2 border">{item.bloodGroup}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">{new Date(item.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory
