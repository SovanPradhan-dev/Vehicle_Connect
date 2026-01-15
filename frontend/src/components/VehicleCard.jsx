import API from "../api";

export default function VehicleCard({ vehicle, requestStatus, onBookingSuccess }) {
  const requestBooking = async () => {
    try {
      await API.post("/bookings", {
        vehicleId: vehicle._id,
        vehicleType: vehicle.type,
        pricePerKm: vehicle.pricePerKm,
        city: vehicle.city,
      });
      alert("Booking request sent!");
      onBookingSuccess(); // Refresh request status
    } catch (err) {
      console.error(err.response || err);
      alert("Booking failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{vehicle.type}</h3>
        <p className="text-sm text-gray-500">
          ₹{vehicle.pricePerKm}/hr • {vehicle.city}
        </p>
        <p
          className={`text-sm font-medium ${
            vehicle.isAvailable ? "text-green-600" : "text-red-600"
          }`}
        >
          {vehicle.isAvailable ? "Available" : "Unavailable"}
        </p>

        {requestStatus && (
          <p className="mt-1 text-sm">
            Status:{" "}
            <span
              className={
                requestStatus === "pending"
                  ? "text-yellow-600"
                  : requestStatus === "accepted"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1)}
            </span>
          </p>
        )}
      </div>

      <button
        disabled={!vehicle.isAvailable || requestStatus === "accepted"}
        onClick={requestBooking}
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {requestStatus === "accepted" ? "Accepted" : requestStatus === "pending" ? "Requested" : "Request"}
      </button>
    </div>
  );
}
