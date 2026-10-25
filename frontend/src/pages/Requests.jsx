import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/owner/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id, status) => {
    try {
      await API.patch(`/owner/requests/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar role="owner" />
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Booking Requests</h2>

        {loading && <p className="text-gray-500">Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && requests.length === 0 && (
          <p className="text-gray-500">No booking requests</p>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Vehicle: {req.vehicle?.type} · ₹{req.vehicle?.pricePerKm}/km · {req.vehicle?.city}
                </p>
                {req.seeker && (
                  <p className="text-sm text-gray-600 mt-1">
                    Seeker: {req.seeker.name} ({req.seeker.email})
                  </p>
                )}
                <span
                  className={`inline-block mt-2 px-2 py-1 text-sm font-semibold rounded-full ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(req._id, "accepted")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(req._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
