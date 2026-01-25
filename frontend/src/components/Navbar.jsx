import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Safely get username from localStorage
  const userName = localStorage.getItem("userName") || "User";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        VehicleConnect
      </h1>

      {/* Menu Links */}
      <div className="flex items-center gap-6">
        {role === "seeker" && (
          <>
            <Link to="/location" className="text-gray-700 hover:text-blue-600 transition">
              Find Vehicles
            </Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-blue-600 transition">
              Nearby
            </Link>
          </>
        )}

        {role === "owner" && (
          <>
            <Link to="/owner/dashboard" className="text-gray-700 hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link to="/owner/requests" className="text-gray-700 hover:text-blue-600 transition">
              Requests
            </Link>

            {/* Add Vehicle Button */}
            <button
              onClick={() => navigate("/registervehicle")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
            >
              + Add Vehicle
            </button>
          </>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-semibold">
              {userName.charAt(0)}
            </div>
            <span className="hidden md:inline">{userName}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
