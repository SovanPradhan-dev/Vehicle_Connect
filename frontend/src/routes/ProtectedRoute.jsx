import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const mode = localStorage.getItem("mode");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!mode) {
    return <Navigate to="/role" replace />;
  }

  if (role && mode !== role) {
    return <Navigate to="/role" replace />;
  }

  return children;
};

export default ProtectedRoute;
