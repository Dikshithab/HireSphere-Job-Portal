import { useEffect, useState} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  const role = user?.role;
  const userName = user?.name;

  const isJobSeeker = role === "JOB_SEEKER";
  const isEmployer = role === "EMPLOYER";
  useEffect(() => {

  if (!token) {
    setUnreadCount(0);
    return;
  }

  const fetchUnreadCount = async () => {

    try {

      const response = await api.get(
        "/notifications/unread-count/"
      );

      setUnreadCount(
        response.data.unread_count || 0
      );

    } catch (error) {

      console.error(
        "Error fetching notification count:",
        error
      );

    }

  };

  fetchUnreadCount();

}, [token]);

  const dashboardPath = isEmployer ? "/employer" : "/seeker";

  /* =====================================================
     ACTIONS
  ===================================================== */

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const openProfile = () => {
    navigate("/profile");
    closeMenu();
  };

  /* =====================================================
     USER INITIAL
  ===================================================== */

  const getUserInitial = () => {
    if (!userName) return "U";

    return userName.charAt(0).toUpperCase();
  };

  /* =====================================================
     NAV LINK CLASS
  ===================================================== */

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-glow"></div>

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to={token ? dashboardPath : "/"}
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="HireSphere Home"
        >
          <span className="logo-mark">
            <span className="logo-mark-inner">H</span>
          </span>

          <span className="logo-text">
            Hire<span>Sphere</span>
          </span>

          <span className="logo-ai-badge">
            AI
          </span>
        </Link>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className={`menu-toggle ${
            mobileMenuOpen ? "is-active" : ""
          }`}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          aria-label={
            mobileMenuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div
          className={`navbar-links ${
            mobileMenuOpen ? "is-open" : ""
          }`}
        >

          {/* =================================================
              GUEST USER
          ================================================= */}

          {!token ? (
            <div className="guest-navigation">

              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMenu}
              >
                <span className="nav-icon">
                  →
                </span>

                <span>Sign In</span>
              </NavLink>

              <Link
                to="/register"
                className="register-btn"
                onClick={closeMenu}
              >
                <span>Get Started</span>

                <span className="cta-arrow">
                  →
                </span>
              </Link>

            </div>
          ) : (

            <>

              {/* =============================================
                  JOB SEEKER NAVIGATION
              ============================================= */}

              {isJobSeeker && (
                <div className="role-navigation">

                  <NavLink
                    to="/seeker"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Dashboard"
                  >
                    <span className="nav-icon">
                      ⌂
                    </span>

                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/jobs"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Find Jobs"
                  >
                    <span className="nav-icon">
                      ⌕
                    </span>

                    <span>Find Jobs</span>
                  </NavLink>
                  <NavLink
  to="/saved-jobs"
  className={navLinkClass}
  onClick={closeMenu}
  title="Saved Jobs"
>
  <span className="nav-icon">
    ♡
  </span>

  <span>Saved Jobs</span>
                </NavLink>

                  <NavLink
                    to="/applications"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="My Applications"
                  >
                    <span className="nav-icon">
                      ▤
                    </span>

                    <span>Applications</span>
                  </NavLink>

                  {/* AI ANALYZER */}

                  <NavLink
                    to="/resume-analyzer"
                    className={({ isActive }) =>
                      `nav-link ai-nav-link ${
                        isActive ? "active" : ""
                      }`
                    }
                    onClick={closeMenu}
                    title="AI Resume Analyzer"
                  >
                    <span className="nav-icon ai-icon">
                      ✦
                    </span>

                    <span>AI Analyzer</span>

                    <span className="ai-badge">
                      AI
                    </span>
                  </NavLink>

                  {/* JOB MATCHES */}

                  <NavLink
                    to="/job-matches"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="AI Job Matches"
                  >
                    <span className="nav-icon">
                      ◎
                    </span>

                    <span>Job Matches</span>
                  </NavLink>

                  {/* RESUME BUILDER */}

                  <NavLink
                    to="/resume-builder"
                    className="resume-builder-nav"
                    onClick={closeMenu}
                    title="Build your resume"
                  >
                    <span className="resume-icon">
                      ✦
                    </span>

                    <span>Build Resume</span>
                  </NavLink>

                </div>
              )}

              {/* =============================================
                  EMPLOYER NAVIGATION
              ============================================= */}

              {isEmployer && (
                <div className="role-navigation">

                  <NavLink
                    to="/employer"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Employer Dashboard"
                  >
                    <span className="nav-icon">
                      ⌂
                    </span>

                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/create-job"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Post a new job"
                  >
                    <span className="nav-icon">
                      ＋
                    </span>

                    <span>Post Job</span>
                  </NavLink>

                  <NavLink
                    to="/employer/jobs"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Manage Jobs"
                  >
                    <span className="nav-icon">
                      ▣
                    </span>

                    <span>Manage Jobs</span>
                  </NavLink>

                  <NavLink
                    to="/employer/applications"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Applications"
                  >
                    <span className="nav-icon">
                      ♙
                    </span>

                    <span>Applications</span>
                  </NavLink>

                  <NavLink
                    to="/create-company"
                    className={navLinkClass}
                    onClick={closeMenu}
                    title="Company Profile"
                  >
                    <span className="nav-icon">
                      ▤
                    </span>

                    <span>Company</span>
                  </NavLink>

                </div>
              )}

              {/* =============================================
                  USER PROFILE
              ============================================= */}

              <div className="navbar-user">

                <button
                  type="button"
                  className="user-profile"
                  onClick={openProfile}
                  aria-label="Open profile"
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

                  <span
                    className="profile-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <span className="logout-icon">
                    ↪
                  </span>

                  <span>
                    Logout
                  </span>
                </button>

              </div>

          <NavLink
  to="/notifications"
  className="notification-nav-link"
  onClick={closeMenu}
  title="Notifications"
>
  <span className="notification-icon">
    🔔
  </span>

  <span className="notification-text">
    Notifications
  </span>

  {unreadCount > 0 && (
    <span className="notification-badge">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )}
</NavLink>
</>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;