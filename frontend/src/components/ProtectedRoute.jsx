import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

  const role = user?.role;

  // ================================
  // NOT LOGGED IN
  // ================================

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ================================
  // ROLE CHECK
  // ================================

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/jobs"
        replace
      />
    );
  }

  // ================================
  // AUTHORIZED
  // ================================

  return children;
}

export default ProtectedRoute;
