import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("fullName");

  const isJobSeeker = role === "JOB_SEEKER";
  const isEmployer = role === "EMPLOYER";

  const dashboardPath = isEmployer ? "/employer" : "/seeker";

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const getUserInitial = () => {
    if (!userName) return "U";
    return userName.charAt(0).toUpperCase();
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to={token ? dashboardPath : "/"}
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            💼
          </span>

          <span className="logo-text">
            Hire<span>Sphere</span>
          </span>
        </Link>


        {/* MOBILE MENU */}

        <button
          className={`menu-toggle ${
            mobileMenuOpen ? "is-active" : ""
          }`}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* NAVIGATION */}

        <div
          className={`navbar-links ${
            mobileMenuOpen ? "is-open" : ""
          }`}
        >

          {/* NOT LOGGED IN */}

          {!token ? (

            <div className="guest-navigation">

              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Sign In
              </NavLink>

              <Link
                to="/register"
                className="register-btn"
                onClick={closeMenu}
              >
                Get Started
              </Link>

            </div>

          ) : (

            <>

              {/* JOB SEEKER */}

              {isJobSeeker && (
  <div className="role-navigation">

    <NavLink
      to="/seeker"
      className={navLinkClass}
      onClick={closeMenu}
    >
      <span className="nav-icon">⌂</span>
      Dashboard
    </NavLink>

    <NavLink
      to="/jobs"
      className={navLinkClass}
      onClick={closeMenu}
    >
      <span className="nav-icon">⌕</span>
      Find Jobs
    </NavLink>

    <NavLink
      to="/applications"
      className={navLinkClass}
      onClick={closeMenu}
    >
      <span className="nav-icon">▤</span>
      Applications
    </NavLink>

    <NavLink
      to="/resume-analyzer"
      className={navLinkClass}
      onClick={closeMenu}
    >
      <span className="nav-icon">✦</span>
      AI Analyzer
    </NavLink>

    <NavLink
      to="/job-matches"
      className={navLinkClass}
      onClick={closeMenu}
    >
      <span className="nav-icon">◎</span>
      Job Matches
    </NavLink>

    <NavLink
      to="/resume-builder"
      className="resume-builder-nav"
      onClick={closeMenu}
    >
      <span>＋</span>
      Resume Builder
    </NavLink>

  </div>
)}


              {/* EMPLOYER */}

              {isEmployer && (

                <div className="role-navigation">

                  <NavLink
                    to="/employer"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    <span>⌂</span>
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/create-job"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    <span>＋</span>
                    Post Job
                  </NavLink>

                  <NavLink
                    to="/employer/jobs"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    <span>▣</span>
                    Manage Jobs
                  </NavLink>

                  <NavLink
                    to="/employer/applications"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    <span>♙</span>
                    Applications
                  </NavLink>

                  <NavLink
                    to="/create-company"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    <span>▤</span>
                    Company
                  </NavLink>

                </div>

              )}


              {/* USER */}

              <div className="navbar-user">

                <div
                  className="user-profile"
                  onClick={() => {
                    navigate("/profile");
                    closeMenu();
                  }}
                >

                  <div className="user-avatar">
                    {getUserInitial()}
                  </div>

                  <div className="user-details">

                    <span className="user-role">
                      {isEmployer
                        ? "Employer"
                        : "Job Seeker"}
                    </span>

                    <strong>
                      {userName || "User"}
                    </strong>

                  </div>

                  <span className="profile-arrow">
                    ›
                  </span>

                </div>


                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <span>↪</span>
                  Logout
                </button>

              </div>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
