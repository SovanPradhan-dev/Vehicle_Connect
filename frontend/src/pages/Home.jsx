import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold text-blue-600">
          VehicleRent
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-blue-600 font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 py-20">
        <h2 className="text-5xl font-extrabold leading-tight text-gray-800 max-w-3xl">
          Smart Vehicle Rental Platform for  
          <span className="text-blue-600"> Owners & Seekers</span>
        </h2>

        <p className="text-gray-600 mt-6 max-w-2xl text-lg">
          List your vehicle, manage bookings, or rent vehicles easily — all in one secure platform.
        </p>

        <div className="flex gap-6 mt-10">
          <button
            onClick={() => navigate("/register?role=owner")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow"
          >
            Become an Owner
          </button>

          <button
            onClick={() => navigate("/register?role=seeker")}
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-xl text-lg hover:bg-blue-50"
          >
            Rent a Vehicle
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Easy Vehicle Listing",
            desc: "Owners can list vehicles with pricing, city, and availability."
          },
          {
            title: "Real-time Booking",
            desc: "Seekers can request bookings instantly and track status."
          },
          {
            title: "Secure & Role-Based",
            desc: "Separate dashboards for owners and seekers with JWT security."
          }
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {f.title}
            </h3>
            <p className="text-gray-600">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* OWNER / SEEKER CTA */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          
          <div className="bg-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              For Vehicle Owners
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✔ Add & manage vehicles</li>
              <li>✔ Accept or reject bookings</li>
              <li>✔ Earn per km</li>
            </ul>
            <button
              onClick={() => navigate("/register?role=owner")}
              className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium"
            >
              Start Earning
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              For Rent Seekers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✔ Search by city</li>
              <li>✔ Request bookings</li>
              <li>✔ Get owner contact after approval</li>
            </ul>
            <button
              onClick={() => navigate("/register?role=seeker")}
              className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium"
            >
              Find Vehicles
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © {new Date().getFullYear()} Sovan Pradhan. All rights reserved.
      </footer>

    </div>
  );
}
