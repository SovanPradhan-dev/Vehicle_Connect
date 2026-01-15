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
    const res = await API.patch("/auth/role", { role });

    // ✅ SAVE ROLE LOCALLY (CRITICAL)
    localStorage.setItem("mode", role);

    // OPTIONAL: if backend returns updated user
    if (res.data?.user?.role) {
      localStorage.setItem("mode", res.data.user.role);
    }

    // ✅ REDIRECT
    if (role === "owner") {
      navigate("/registervehicle", { replace: true });
    } else {
      navigate("/location", { replace: true });
    }
  } catch (err) {
    console.error(err);
    setError("Failed to save role");
  }
};


  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold">Choose Your Role</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={() => setRole("owner")}
          className={`w-48 p-4 border rounded ${
            role === "owner" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Vehicle Owner
        </button>

        <button
          onClick={() => setRole("seeker")}
          className={`w-48 p-4 border rounded ${
            role === "seeker" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Vehicle Seeker
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}
