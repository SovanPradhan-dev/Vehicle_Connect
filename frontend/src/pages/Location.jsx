import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // optional if you want to fetch vehicles

export default function Location() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!city || !pincode) {
      setError("Please enter both city and pincode");
      return;
    }

    setLoading(true);

    try {
      // Optional: fetch vehicles nearby from backend
      // const res = await API.get(`/vehicles?city=${city}&pincode=${pincode}`);
      // console.log("Vehicles nearby:", res.data);

      // For now, just navigate to a page showing vehicles (you can create it)
      localStorage.setItem(
  "location",
  JSON.stringify({ city, pincode })
);

      navigate("/vehicles", { state: { city, pincode } });
    } catch (err) {
      console.error(err.response || err);
      setError("Failed to find vehicles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 border p-6 rounded bg-white shadow-md">
        <h2 className="text-lg font-bold mb-4">Enter Location</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="City"
            className="w-full border p-2 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            placeholder="Pincode"
            className="w-full border p-2 rounded"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Finding..." : "Find Vehicles"}
          </button>
        </form>
      </div>
    </div>
  );
}
