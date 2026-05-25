import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    // Si no está logueado, redirigir al home
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.rol !== allowedRole) {
    // Si está logueado pero no tiene el rol correcto
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
