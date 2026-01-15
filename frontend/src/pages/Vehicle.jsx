import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import API from "../api";

export default function Vehicle() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedLocation = JSON.parse(localStorage.getItem("location"));
  const city = location.state?.city || savedLocation?.city;
  const pincode = location.state?.pincode || savedLocation?.pincode;

  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]); // ← Track user's requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const VEHICLES = [
    { type: "Truck", icon: "🚚" },
    { type: "Van", icon: "🚐" },
    { type: "Car", icon: "🚗" },
    { type: "Bike", icon: "🏍️" },
  ];

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/vehicles", {
        params: {
          city,
          pincode,
          type: selectedType || undefined,
        },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch my requests
  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/bookings/my");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!city || !pincode) {
      navigate("/location");
      return;
    }
    fetchVehicles();
    fetchMyRequests();
  }, [city, pincode, selectedType]);

  // Helper: get request status for a vehicle
  const getRequestStatus = (vehicleId) => {
    if (!Array.isArray(requests)) return null;
    const req = requests.find((r) => r.vehicleId === vehicleId);
    return req ? req.status : null; // "pending", "accepted", "rejected"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="seeker" />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Nearby Vehicles {city && `in ${city}`}
          </h2>
        </div>

        {/* Vehicle Type Filter */}
        <div className="flex gap-3 mb-4">
          {VEHICLES.map((v) => (
            <button
              key={v.type}
              onClick={() =>
                setSelectedType(selectedType === v.type ? "" : v.type)
              }
              className={`border rounded-lg p-3 flex flex-col items-center gap-1 transition
                ${
                  selectedType === v.type
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-gray-400"
                }
              `}
            >
              <span className="text-2xl">{v.icon}</span>
              <span className="text-sm">{v.type}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading vehicles...
          </p>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Vehicle List */}
        {!loading && !error && (
          <div className="grid gap-4">
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <VehicleCard
                  key={v._id}
                  vehicle={v}
                  requestStatus={getRequestStatus(v._id)}
                  onBookingSuccess={fetchMyRequests} // refresh requests after new booking
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No vehicles found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
