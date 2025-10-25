import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DonationCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, hospital, camp } = location.state || {};

  // Display-only data
  const donorName = user?.name || "N/A";
  const donorContact = user?.contact || "N/A";
  const bloodGroup = user?.bloodGroup || "N/A";
  const hospitalName = hospital?.name || "N/A";
  const campName = camp?.name || "N/A";
  const donationDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  // State for the form
  const [unitsDonated, setUnitsDonated] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (unitsDonated <= 0) {
      setError("Units donated must be at least 1.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    const newDonation = {
      donorId: user?.id,
      hospitalId: hospital?.id,
      campId: camp?.id || null,
      date: donationDate,
      unitsDonated: parseInt(unitsDonated),
    };

    try {
      // API endpoint from your backend route
      const response = await fetch("http://localhost:3000/api/v1/donations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDonation),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to a success page or dashboard after creation
        // You might want to pass some state to the next page
        navigate("/dashboard", { state: { message: "Donation logged successfully!" } });
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      console.error("Donation creation failed:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Log Your Donation
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Display Section */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Donor Name</label>
            <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600">
              {donorName}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Contact</label>
              <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600">
                {donorContact}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Blood Group</label>
              <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600 font-semibold">
                {bloodGroup}
              </div>
            </div>
          </div>
          {hospitalName !== "N/A" && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Hospital</label>
              <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600">
                {hospitalName}
              </div>
            </div>
          )}
          {campName !== "N/A" && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Camp</label>
              <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600">
                {campName}
              </div>
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Date</label>
            <div className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600">
              {donationDate}
            </div>
          </div>
          <hr className="my-2"/>
          {/* Input Section */}
          <div>
            <label htmlFor="unitsDonated" className="block text-gray-700 mb-1 font-bold text-lg">
              How many units did you donate?
            </label>
            <input
              id="unitsDonated"
              type="number"
              min="1"
              value={unitsDonated}
              onChange={(e) => setUnitsDonated(e.target.value)}
              className="w-full border-gray-300 px-4 py-3 rounded-md text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-transform transform hover:scale-105 mt-2 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Confirm Donation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationCreate;

