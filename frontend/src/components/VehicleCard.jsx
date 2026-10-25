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
    <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition transform hover:-translate-y-1">
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{vehicle.type}</h3>
        <p className="text-sm text-gray-500">
          ₹{vehicle.pricePerKm}/km • {vehicle.city}
        </p>
        <p
          className={`text-sm font-medium mt-1 ${
            vehicle.isAvailable ? "text-green-600" : "text-red-600"
          }`}
        >
          {vehicle.isAvailable ? "Available" : "Unavailable"}
        </p>

        {requestStatus && (
          <p className="mt-2 text-sm">
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
        disabled={!vehicle.isAvailable || requestStatus === "accepted" || requestStatus === "pending"}
        onClick={requestBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {requestStatus === "accepted" ? "Accepted" : requestStatus === "pending" ? "Requested" : requestStatus === "rejected" ? "Rejected" : "Request"}
      </button>
    </div>
  );
}
