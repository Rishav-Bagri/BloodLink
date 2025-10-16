import { useState } from "react"
import { useNavigate } from "react-router-dom"

function HospitalLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: call your backend login API
    // if successful:
    navigate("/hospital/dashboard")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Hospital Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <span>New hospital? </span>
          <span
            onClick={() => navigate("/hospital/register")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  )
}

export default HospitalLogin
