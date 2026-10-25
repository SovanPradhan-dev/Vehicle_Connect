import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      if (res.data.name) localStorage.setItem("userName", res.data.name);

      // redirect after login
      if (res.data.role) {
        localStorage.setItem("mode", res.data.role);
        if (res.data.role === "owner") {
          navigate("/ownerdashboard");
        } else if (res.data.role === "seeker") {
          navigate("/location");
        } else {
          navigate("/role");
        }
      } else {
        navigate("/role");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded-2xl space-y-4 bg-white shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded-lg"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full border p-2 rounded-lg hover:bg-gray-50 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
