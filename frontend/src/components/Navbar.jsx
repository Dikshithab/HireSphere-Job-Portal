import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Star,
  FileText,
  Sparkles,
  Target,
  FilePenLine,
  Plus,
  ClipboardList,
  FolderKanban,
  Building2,
  BarChart3,
  Moon,
  Sun,
  Bell,
  LogOut,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import api from "../services/api";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("hiresphere-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  const token = localStorage.getItem("token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }

  const userRole = user?.role;

  /* =========================
     THEME
     ========================= */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("hiresphere-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "dark" ? "light" : "dark"
    );
  };

  /* =========================
     NOTIFICATIONS
     ========================= */

  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get(
          "/notifications/unread-count/"
        );

        const count =
          response?.data?.unreadCount !== undefined
            ? response.data.unreadCount
            : response?.data?.count !== undefined
            ? response.data.count
            : typeof response?.data === "number"
            ? response.data
            : 0;

        setUnreadCount(count);
      } catch (err) {
        console.error(
          "Failed to fetch unread notifications count",
          err
        );
      }
    };

    fetchUnreadCount();

    const handleNotificationsUpdated = () => {
      fetchUnreadCount();
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdated
      );
    };
  }, [token]);

  /* =========================
     MOBILE MENU
     ========================= */

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  /* =========================
     LOGOUT
     ========================= */

  const handleLogout = () => {
    const currentTheme =
      localStorage.getItem("hiresphere-theme");

    localStorage.clear();

    if (currentTheme) {
      localStorage.setItem(
        "hiresphere-theme",
        currentTheme
      );
    }

    navigate("/login");
  };

  /* =========================
     USER DETAILS
     ========================= */

  const userName =
    user?.name ||
    user?.fullName ||
    user?.email ||
    "User";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  const formattedRole =
    userRole === "EMPLOYER"
      ? "Employer"
      : userRole === "JOB_SEEKER"
      ? "Job Seeker"
      : userRole || "User";

  /* =========================
     LOGO DESTINATION
     ========================= */

  const logoDestination = token
    ? userRole === "EMPLOYER"
      ? "/employer"
      : "/seeker"
    : "/";

  return (
    <nav className="navbar">
      <div
        className="navbar-glow"
        aria-hidden="true"
      />

      <div className="navbar-container">

        {/* =========================
            LOGO
            ========================= */}

        <Link
          to={logoDestination}
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          <div className="logo-mark">
            <div className="logo-mark-inner" />
          </div>

          <span className="logo-text">
            HireSphere
          </span>

          <span className="logo-ai-badge">
            AI
          </span>
        </Link>

        {/* =========================
            MOBILE MENU
            ========================= */}

        <button
          className={`menu-toggle ${
            isOpen ? "is-active" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* =========================
            NAVIGATION
            ========================= */}

        <div
          className={`navbar-links ${
            isOpen ? "is-open" : ""
          }`}
        >

          {/* =========================
              AUTHENTICATED NAVIGATION
              ========================= */}

          {token ? (
            <div className="role-navigation">

              {/* JOB SEEKER */}

              {userRole === "JOB_SEEKER" && (
                <>
                  <NavLink
                    to="/seeker"
                    end
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard className="nav-icon" />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/jobs"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Search className="nav-icon" />
                    Find Jobs
                  </NavLink>

                  <NavLink
                    to="/saved-jobs"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Star className="nav-icon" />
                    Saved
                  </NavLink>

                  <NavLink
                    to="/applications"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <FileText className="nav-icon" />
                    Applications
                  </NavLink>

                  <NavLink
                    to="/resume-analyzer"
                    className="ai-nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Sparkles className="ai-icon" />
                    AI Analyzer

                    <span className="ai-badge">
                      AI
                    </span>
                  </NavLink>

                  <NavLink
                    to="/job-matches"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Target className="nav-icon" />
                    Matches
                  </NavLink>

                  <NavLink
                    to="/resume-builder"
                    className="resume-builder-nav"
                    onClick={closeMobileMenu}
                  >
                    <FilePenLine className="resume-icon" />
                    Build Resume
                  </NavLink>
                </>
              )}

              {/* EMPLOYER */}

              {userRole === "EMPLOYER" && (
                <>
                  <NavLink
                    to="/employer"
                    end
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard className="nav-icon" />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/create-job"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Plus className="nav-icon" />
                    Post Job
                  </NavLink>

                  <NavLink
                    to="/employer/jobs"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <ClipboardList className="nav-icon" />
                    Manage Jobs
                  </NavLink>

                  <NavLink
                    to="/employer/applications"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <FolderKanban className="nav-icon" />
                    Applications
                  </NavLink>

                  <NavLink
                    to="/create-company"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <Building2 className="nav-icon" />
                    Company
                  </NavLink>

                  <NavLink
                    to="/recruiter-analytics"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    <BarChart3 className="nav-icon" />
                    Analytics
                  </NavLink>
                </>
              )}
            </div>
          ) : (

            /* =========================
               GUEST NAVIGATION
               ========================= */

            <div className="guest-navigation">

              <NavLink
                to="/login"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Sign In
              </NavLink>

              <NavLink
                to="/register"
                className="register-btn"
                onClick={closeMobileMenu}
              >
                Get Started

                <ArrowRight
                  className="cta-arrow"
                  aria-hidden="true"
                />
              </NavLink>

            </div>
          )}

          {/* =========================
              RIGHT ACTIONS
              ========================= */}

          <div className="navbar-actions">

            {/* THEME */}

            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${
                theme === "dark"
                  ? "light"
                  : "dark"
              } mode`}
              title={`Switch to ${
                theme === "dark"
                  ? "light"
                  : "dark"
              } mode`}
            >
              {theme === "dark" ? (
                <Sun className="theme-toggle-icon" />
              ) : (
                <Moon className="theme-toggle-icon" />
              )}

              <span className="theme-toggle-label">
                {theme === "dark"
                  ? "Light"
                  : "Dark"}
              </span>
            </button>

            {/* NOTIFICATIONS */}

            {token && (
              <NavLink
                to="/notifications"
                className="notification-nav-link"
                onClick={closeMobileMenu}
              >
                <Bell
                  className="notification-icon"
                  aria-hidden="true"
                />

                <span className="notification-text">
                  Notifications
                </span>

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* PROFILE */}

            {token && (
              <>
                <Link
                  to="/profile"
                  className="navbar-user"
                  onClick={closeMobileMenu}
                >
                  <div className="user-profile">

                    <div className="user-avatar">
                      {userInitial}
                    </div>

                    <div className="user-details">
                      <span className="user-name">
                        {userName}
                      </span>

                      <span className="user-role">
                        {formattedRole}
                      </span>
                    </div>

                    <ChevronRight
                      className="profile-arrow"
                      aria-hidden="true"
                    />

                  </div>
                </Link>

                {/* LOGOUT */}

                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="logout-btn"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut
                    className="logout-icon"
                    aria-hidden="true"
                  />

                  <span>
                    Logout
                  </span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;