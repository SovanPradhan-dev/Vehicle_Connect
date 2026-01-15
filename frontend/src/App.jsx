import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Register from "./pages/register.jsx";
import Signin from "./pages/signin.jsx";
import SelectRole from "./pages/SelectRole.jsx";
import Location from "./pages/Location.jsx";
import Vehicle from "./pages/Vehicle.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import RegisterVehicle from "./pages/RegisterVehicle.jsx";
import Requests from "./pages/Requests.jsx";
import Role from "./pages/SelectRole.jsx"

import ProtectedRoute from "./routes/protectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />


        <Route
          path="/location"
          element={
            <ProtectedRoute role="seeker">
              <Location />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute role="seeker">
              <Vehicle />
            </ProtectedRoute>
          }
        />

        {/* 🏠 OWNER ROUTES */}
        <Route
          path="/ownerdashboard"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registervehicle"
          element={
            <ProtectedRoute role="owner">
              <RegisterVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute role="owner">
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route path="/role" element = {<RoleRoute><Role/></RoleRoute>}/>
      </Routes>
    </Router>
  );
};

export default App;
