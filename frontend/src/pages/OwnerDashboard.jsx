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
    } catch (err) {
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
    } catch (err) {
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
      const res = await API.patch(
        `/owner/vehicles/${vehicleId}/availability`
      );

      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? res.data.vehicle : v))
      );
    } catch (err) {
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
    } catch (err) {
      alert("Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="owner" />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* ================= VEHICLES ================= */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Vehicles</h2>

            {vehicles.length > 0 && (
              <button
                onClick={() => navigate("/registervehicle")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Add Vehicle
              </button>
            )}
          </div>

          {loadingVehicles ? (
            <p className="text-center animate-pulse">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center space-y-4">
              <p className="text-gray-600 font-medium">
                You have not registered any vehicle yet 🚗
              </p>

              <button
                onClick={() => navigate("/registervehicle")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Register Vehicle
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{v.type}</h3>
                    <p className="text-sm text-gray-500">
                      Price: ₹{v.pricePerKm}/km · City: {v.city}
                    </p>
                    <p
                      className={`text-sm mt-1 font-medium ${
                        v.isAvailable
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {v.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleAvailability(v._id)}
                    className={`px-4 py-2 rounded-lg text-white ${
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
          <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>

          {loadingRequests ? (
            <p className="text-center animate-pulse">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-500">No booking requests</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      Vehicle: {r.vehicle?.type} · ₹
                      {r.vehicle?.pricePerKm}/km · {r.city}
                    </p>

                    <p
                      className={`text-sm mt-1 ${
                        r.status === "pending"
                          ? "text-yellow-600"
                          : r.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status: {r.status}
                    </p>

                    {r.status === "accepted" && (
                      <p className="text-sm text-gray-600 mt-1">
                        {r.seeker?.name} — {r.seeker?.email}
                      </p>
                    )}
                  </div>

                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequest(r._id, "accepted")}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequest(r._id, "rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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

        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}
