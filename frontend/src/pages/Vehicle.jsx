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
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const VEHICLES = [
    { type: "Truck", icon: "🚚" },
    { type: "Van", icon: "🚐" },
    { type: "Car", icon: "🚗" },
    { type: "Bike", icon: "🏍️" },
  ];

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/vehicles", {
        params: { city, pincode, type: selectedType || undefined },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

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

  const getRequestStatus = (vehicleId) => {
    if (!Array.isArray(requests)) return null;
    const req = requests.find((r) => r.vehicleId === vehicleId);
    return req ? req.status : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar role="seeker" />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800">
          Nearby Vehicles {city && `in ${city}`}
        </h2>

        {/* Vehicle Type Filter */}
        <div className="flex gap-3 overflow-x-auto py-2">
          {VEHICLES.map((v) => (
            <button
              key={v.type}
              onClick={() =>
                setSelectedType(selectedType === v.type ? "" : v.type)
              }
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all duration-300 
                ${selectedType === v.type
                  ? "bg-blue-50 border-blue-500 text-blue-600 shadow-md"
                  : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm"
                }`}
            >
              <span className="text-2xl">{v.icon}</span>
              <span className="text-sm font-medium">{v.type}</span>
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-md rounded-2xl p-6 animate-pulse h-40"
              ></div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Vehicle List */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <VehicleCard
                  key={v._id}
                  vehicle={v}
                  requestStatus={getRequestStatus(v._id)}
                  onBookingSuccess={fetchMyRequests}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10 text-lg">
                No vehicles found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
