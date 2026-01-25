import { useNavigate } from "react-router-dom";
import HeroIllustration from "../assets/hero-illustration.svg"; // you can use any illustration or image

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-md shadow-md px-12 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600 tracking-wide">VehicleRent</h1>
        <div className="flex gap-5">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-36 pb-32 gap-10">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Rent or List Vehicles <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Easily & Securely</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
            A modern vehicle rental platform for owners and seekers. Manage bookings, earn revenue, or find your next ride—all in one secure place.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mt-6">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 shadow-xl transition transform hover:scale-105"
            >
              Become an Owner
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition transform hover:scale-105"
            >
              Rent a Vehicle
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={HeroIllustration}
            alt="Hero Illustration"
            className="w-full max-w-lg animate-float"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12">
        {[
          { icon: "🚗", title: "Easy Listings", desc: "Owners can list vehicles with detailed info and pricing." },
          { icon: "⏱️", title: "Instant Booking", desc: "Seekers can book vehicles in real-time with notifications." },
          { icon: "🔒", title: "Secure Platform", desc: "Role-based dashboards with JWT authentication for security." },
        ].map((f, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 text-center hover:shadow-xl transition-transform transform hover:-translate-y-3 hover:scale-105"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* OWNER / SEEKER CTA */}
      <section className="bg-blue-700 py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-20 -skew-y-3"></div>
        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-white/10 rounded-3xl p-10 backdrop-blur-md shadow-lg hover:scale-105 transition transform text-center md:text-left">
            <h3 className="text-3xl font-bold mb-5">For Vehicle Owners</h3>
            <ul className="space-y-3 text-lg mb-6">
              <li>✔ Add & manage vehicles</li>
              <li>✔ Accept or reject bookings</li>
              <li>✔ Earn per km</li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 shadow-lg transition"
            >
              Start Earning
            </button>
          </div>

          <div className="bg-white/10 rounded-3xl p-10 backdrop-blur-md shadow-lg hover:scale-105 transition transform text-center md:text-left">
            <h3 className="text-3xl font-bold mb-5">For Rent Seekers</h3>
            <ul className="space-y-3 text-lg mb-6">
              <li>✔ Search by city</li>
              <li>✔ Request bookings</li>
              <li>✔ Get owner contact after approval</li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 shadow-lg transition"
            >
              Find Vehicles
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-300 text-sm py-8 bg-blue-800">
        © {new Date().getFullYear()} Sovan Pradhan. All rights reserved.
      </footer>
    </div>
  );
}
