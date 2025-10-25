import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HospitalLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold login errors
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error on new submission

    try {
      // Assuming your API is served from the same domain, at this endpoint
      const response = await fetch("http://localhost:3000/api/v1/hospitals/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, save hospital ID to local storage
        localStorage.setItem("hospitalId", data.hospital.id);
        // Navigate to the dashboard
        navigate("/hospital/dashboard");
      } else {
        // If the server responds with an error, display it
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      // Handle network errors or cases where the server is down
      console.error("Login API call failed:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Hospital Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
          {/* Display error message if it exists */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <span>New hospital? </span>
          <span
            onClick={() => navigate("/hospital/register")}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default HospitalLogin;
