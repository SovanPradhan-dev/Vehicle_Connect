import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api.js";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");

  // Fetch owner vehicles
  const fetchVehicles = async () => {
    try {
      const res = await API.get("/owner/vehicles");
      setVehicles(res.data);
    } catch {
      setError("Failed to load vehicles");
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Fetch booking requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/owner/requests");
      setRequests(res.data);
    } catch {
      setError("Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchRequests();
  }, []);

  // Toggle vehicle availability
  const toggleAvailability = async (vehicleId) => {
    try {
      const res = await API.patch(`/owner/vehicles/${vehicleId}/availability`);
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? res.data.vehicle : v))
      );
    } catch {
      alert("Failed to update availability");
    }
  };

  // Accept / Reject booking
  const handleRequest = async (requestId, status) => {
    try {
      const res = await API.patch(`/owner/requests/${requestId}`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? res.data.request : r))
      );
    } catch {
      alert("Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar role="owner" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ================= VEHICLES ================= */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">My Vehicles</h2>
            <button
              onClick={() => navigate("/registervehicle")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
            >
              + Add Vehicle
            </button>
          </div>

          {loadingVehicles ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white/50 backdrop-blur-md rounded-2xl p-6 animate-pulse h-32"></div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center space-y-4">
              <p className="text-gray-600 font-medium text-lg">
                You have not registered any vehicle yet 🚗
              </p>
              <button
                onClick={() => navigate("/registervehicle")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register Vehicle
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-6 flex justify-between items-center transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{v.type}</h3>
                    <p className="text-sm text-gray-500">
                      Price: ₹{v.pricePerKm}/km · City: {v.city}
                    </p>
                    <span className={`inline-block mt-2 px-2 py-1 text-sm font-semibold rounded-full ${
                      v.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {v.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleAvailability(v._id)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition transform hover:scale-105 ${
                      v.isAvailable
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {v.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= REQUESTS ================= */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Booking Requests</h2>

          {loadingRequests ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white/50 backdrop-blur-md rounded-2xl p-6 animate-pulse h-28"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No booking requests</p>
          ) : (
            <div className="space-y-6">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-6 flex justify-between items-center transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Vehicle: {r.vehicle?.type} · ₹{r.vehicle?.pricePerKm}/km · {r.city}
                    </p>
                    <span className={`inline-block mt-2 px-2 py-1 text-sm font-semibold rounded-full ${
                      r.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : r.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>

                    {r.status === "accepted" && (
                      <p className="text-sm text-gray-600 mt-2">
                        {r.seeker?.name} — {r.seeker?.email}
                      </p>
                    )}
                  </div>

                  {r.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRequest(r._id, "accepted")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequest(r._id, "rejected")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-center text-red-500 text-lg">{error}</p>}
      </div>
    </div>
  );
}
