import { Navigate } from "react-router-dom";

const RoleRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const mode = localStorage.getItem("mode");

  // ❌ Not logged in → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Role already selected → redirect properly
  if (mode === "owner") {
    return <Navigate to="/ownerdashboard" replace />;
  }

  if (mode === "seeker") {
    return <Navigate to="/location" replace />;
  }

  // ✅ No role yet → SHOW ROLE PAGE
  return children;
};

export default RoleRoute;
