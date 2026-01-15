import { useEffect, useState } from "react";
import API from "../api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/bookings/owner");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    await API.patch(`/bookings/${id}/accept`);
    fetchRequests(); // refresh list
  };

  const handleReject = async (id) => {
    await API.patch(`/bookings/${id}/reject`);
    fetchRequests();
  };

  if (loading) return <p className="p-6">Loading requests...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Booking Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-500">No pending requests</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Requested Vehicle : {req.vehicleType} (₹{req.pricePerKm}/hr)
              </p>
              <p className="text-sm text-gray-600">
                City: {req.city}
              </p>
              <p className="text-sm">
                Status: <span className="capitalize">{req.status}</span>
              </p>
            </div>

            {req.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
