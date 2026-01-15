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

      // redirect after login
      navigate("/role");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-80 p-6 border rounded space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Sign In</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full border p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
