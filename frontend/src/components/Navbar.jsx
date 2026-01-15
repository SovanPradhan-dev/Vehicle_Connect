// components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar({ role }) {
  return (
    <nav className="flex justify-between bg-blue-200 rounded-lg items-center px-6 py-3 border-b">
      <h1 className="text-xl font-bold text-blue-600">
        VehicleConnect
      </h1>

      <div className="flex gap-4">
        {role === "seeker" && (
          <>
            <Link to="/location" className="hover:text-blue-600">
              Find Vehicles
            </Link>
            <Link to="/vehicles" className="hover:text-blue-600">
              Nearby
            </Link>
          </>
        )}

        {role === "owner" && (
          <>
            <Link to="/owner/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/owner/requests" className="hover:text-blue-600">
              Requests
            </Link>
          </>
        )}

        <Link to="/" className="text-red-500 hover:underline">
          Logout
        </Link>
      </div>
    </nav>
  );
}
