import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Axios instance with token interceptor

export default function SelectRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
  if (!role) {
    setError("Please select a role");
    return;
  }

  try {
    await API.patch("/auth/role", { role });

    localStorage.setItem("mode", role);

    if (role === "owner") {
      navigate("/ownerdashboard", { replace: true });
    } else {
      navigate("/location", { replace: true });
    }
  } catch (err) {
    console.error(err);
    setError("Failed to save role");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl font-bold text-gray-800">Choose Your Role</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={() => setRole("owner")}
          className={`w-48 p-6 border rounded-2xl shadow transition ${
            role === "owner" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:shadow-lg"
          }`}
        >
          <div className="text-3xl mb-2">🚗</div>
          <div className="font-semibold">Vehicle Owner</div>
          <div className="text-sm mt-1">List and earn</div>
        </button>

        <button
          onClick={() => setRole("seeker")}
          className={`w-48 p-6 border rounded-2xl shadow transition ${
            role === "seeker" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:shadow-lg"
          }`}
        >
          <div className="text-3xl mb-2">🔍</div>
          <div className="font-semibold">Vehicle Seeker</div>
          <div className="text-sm mt-1">Rent vehicles</div>
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Continue
      </button>
    </div>
  );
}
