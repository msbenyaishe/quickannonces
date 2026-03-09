import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRole, selectIsAuthenticated } from "../features/auth/authSlice";

export default function ProtectedRoute({ children, allowedRoles = [], redirectIfAuthenticated = false }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  // Debug logging
  if (import.meta.env.DEV) {
    console.log("ProtectedRoute check:", { isAuthenticated, role, allowedRoles, redirectIfAuthenticated });
  }

  // If this is a login/register page and user is already authenticated, redirect them
  if (redirectIfAuthenticated && isAuthenticated) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If route requires authentication but user is not authenticated
  if (allowedRoles.length > 0 && !isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  // If route has specific role requirements
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log("ProtectedRoute: Role mismatch. Required:", allowedRoles, "Current:", role);
    // Redirect based on current role
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "user") {
      return <Navigate to="/" replace />;
    }
    // If not authenticated or visitor, redirect to login
    return <Navigate to="/connexion" replace />;
  }

  return children;
}

