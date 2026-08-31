
import { Routes, useLocation } from "react-router-dom";

function AnimatedRoutes({ children }) {
  const location = useLocation();

  return (
    <div className="page-transition">
      <Routes location={location}>
        {children}
      </Routes>
    </div>
  );
}

export default AnimatedRoutes;
