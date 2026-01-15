import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";
import Button from "../components/Button";

export default function RegisterVehicle() {
  const VEHICLES = [
    { type: "Truck", icon: "🚚" },
    { type: "Van", icon: "🚐" },
    { type: "Car", icon: "🚗" },
    { type: "Bike", icon: "🏍️" },
  ];

  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    type: "",
    city: "",
    pincode: "",
    pricePerKm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { type, city, pincode, pricePerKm } = vehicle;

    if (!type || !city || !pincode || !pricePerKm) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/vehicles", {
        type,
        city,
        pincode,
        pricePerKm,
      });

      console.log("Vehicle Registered:", res.data);

      alert(`Vehicle registered successfully: ${type}`);
      setVehicle({ type: "", city: "", pincode: "", pricePerKm: "" });
      navigate("/ownerdashboard");
    } catch (err) {
      console.error(err.response || err);
      setError(
        err.response?.data?.message ||
          "Failed to register vehicle. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="owner" />

      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Register Your Vehicle
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Type */}
          <div>
            <p className="text-sm font-medium mb-2">Select Vehicle Type</p>
            <div className="grid grid-cols-4 gap-3">
              {VEHICLES.map((v) => (
                <button
                  type="button"
                  key={v.type}
                  onClick={() => setVehicle({ ...vehicle, type: v.type })}
                  className={`border rounded-lg p-3 flex flex-col items-center gap-1 transition
                    ${
                      vehicle.type === v.type
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
          </div>

          {/* City */}
          <input
            name="city"
            placeholder="City"
            value={vehicle.city}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />

          {/* Pincode */}
          <input
            name="pincode"
            placeholder="Pincode"
            value={vehicle.pincode}
            onChange={(e) =>
              setVehicle({
                ...vehicle,
                pincode: e.target.value.replace(/\D/g, ""),
              })
            }
            maxLength={6}
            className="w-full border rounded p-2"
            required
          />

          {/* Price per km */}
          <input
            name="pricePerKm"
            placeholder="Price per km"
            value={vehicle.pricePerKm}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !vehicle.type}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Vehicle"}
          </button>
        </form>
      </div>
    </>
  );
}
