import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/JobSeekerDashboard.css";

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET USER NAME
  // ==========================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const userName = user?.name || "Job Seeker";

  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my/");

        console.log("Dashboard Applications:", response.data);

        setApplications(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "Unable to load applications."
        );
      } finally {
        console.log("FETCH FINISHED");
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  console.log("Loading state:", loading);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => application.status === "PENDING"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "SHORTLISTED"
  ).length;

  const hiredApplications = applications.filter(
    (application) => application.status === "HIRED"
  ).length;

  // ==========================================
  // RECENT APPLICATIONS
  // ==========================================

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.applied_at) - new Date(a.applied_at)
    )
    .slice(0, 5);

  // ==========================================
  // STATUS HELPERS
  // ==========================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "SHORTLISTED":
        return "Shortlisted";
      case "HIRED":
        return "Hired";
      case "REJECTED":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "SHORTLISTED":
        return "⭐";
      case "HIRED":
        return "🎉";
      case "REJECTED":
        return "✕";
      default:
        return "•";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="seeker-dashboard">
        <div className="dashboard-background-grid"></div>
        <div className="dashboard-orb dashboard-orb-one"></div>
        <div className="dashboard-orb dashboard-orb-two"></div>

        <div className="dashboard-loading">
          <div className="loading-spinner"></div>

          <span className="loading-label">
            HIRESHERE AI
          </span>

          <h2>Preparing your dashboard</h2>

          <p>
            Loading your applications and career activity...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="seeker-dashboard">
        <div className="dashboard-background-grid"></div>
        <div className="dashboard-orb dashboard-orb-one"></div>
        <div className="dashboard-orb dashboard-orb-two"></div>

        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>

          <span className="error-label">
            SOMETHING WENT WRONG
          </span>

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <Link
            to="/jobs"
            className="dashboard-primary-btn"
          >
            <span>Browse Jobs</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="seeker-dashboard">

      {/* BACKGROUND */}

      <div className="dashboard-background-grid"></div>
      <div className="dashboard-orb dashboard-orb-one"></div>
      <div className="dashboard-orb dashboard-orb-two"></div>
      <div className="dashboard-orb dashboard-orb-three"></div>

      <div className="dashboard-content">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="dashboard-welcome">

          <div className="welcome-content">

            <div className="dashboard-eyebrow">
              <span className="eyebrow-dot"></span>
              JOB SEEKER WORKSPACE
              <span className="eyebrow-ai">AI POWERED</span>
            </div>

            <h1>
              Welcome back,
              <br />
              <span className="gradient-text">
                {userName} 👋
              </span>
            </h1>

            <p>
              Track your applications, discover new
              opportunities, and move closer to your next
              career milestone.
            </p>

            <div className="welcome-actions">

              <Link
                to="/jobs"
                className="dashboard-primary-btn"
              >
                <span className="btn-icon">⌕</span>
                <span>Explore Jobs</span>
                <span className="btn-arrow">→</span>
              </Link>

              <Link
                to="/resume-analyzer"
                className="dashboard-secondary-btn"
              >
                <span>✦</span>
                AI Resume Analyzer
              </Link>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="welcome-visual">

            <div className="visual-glow"></div>

            <div className="career-orbit orbit-one"></div>
            <div className="career-orbit orbit-two"></div>

            <div className="career-core">

              <div className="core-icon">
                ✦
              </div>

              <span>CAREER</span>

              <strong>
                MODE
              </strong>

            </div>

            <div className="floating-card floating-card-top">
              <span>✦</span>
              <div>
                <strong>AI Match</strong>
                <small>Find your fit</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>↗</span>
              <div>
                <strong>Keep growing</strong>
                <small>Your next role is out there</small>
              </div>
            </div>

          </div>

        </section>


        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="dashboard-stats">

          <div className="stat-card stat-total">

            <div className="stat-card-top">
              <div className="stat-icon">
                ◈
              </div>

              <span className="stat-trend">
                ALL TIME
              </span>
            </div>

            <div className="stat-content">

              <span>Total Applications</span>

              <strong>
                {totalApplications}
              </strong>

              <small>
                Applications submitted
              </small>

            </div>

          </div>


          <div className="stat-card stat-pending">

            <div className="stat-card-top">

              <div className="stat-icon">
                ◷
              </div>

              <span className="stat-trend">
                ACTIVE
              </span>

            </div>

            <div className="stat-content">

              <span>Pending</span>

              <strong>
                {pendingApplications}
              </strong>

              <small>
                Awaiting response
              </small>

            </div>

          </div>


          <div className="stat-card stat-shortlisted">

            <div className="stat-card-top">

              <div className="stat-icon">
                ✦
              </div>

              <span className="stat-trend">
                PROGRESS
              </span>

            </div>

            <div className="stat-content">

              <span>Shortlisted</span>

              <strong>
                {shortlistedApplications}
              </strong>

              <small>
                Moving forward
              </small>

            </div>

          </div>


          <div className="stat-card stat-hired">

            <div className="stat-card-top">

              <div className="stat-icon">
                ✓
              </div>

              <span className="stat-trend">
                SUCCESS
              </span>

            </div>

            <div className="stat-content">

              <span>Hired</span>

              <strong>
                {hiredApplications}
              </strong>

              <small>
                Offers received
              </small>

            </div>

          </div>

        </section>


        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                YOUR TOOLKIT
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Everything you need to keep your job search moving.
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <Link
              to="/jobs"
              className="quick-action-card"
            >

              <div className="quick-card-icon">
                ⌕
              </div>

              <div className="quick-card-content">

                <span className="quick-card-number">
                  01
                </span>

                <h3>
                  Find Jobs
                </h3>

                <p>
                  Search fresh opportunities that match your skills.
                </p>

              </div>

              <span className="action-arrow">
                ↗
              </span>

            </Link>


            <Link
              to="/applications"
              className="quick-action-card"
            >

              <div className="quick-card-icon">
                ◫
              </div>

              <div className="quick-card-content">

                <span className="quick-card-number">
                  02
                </span>

                <h3>
                  My Applications
                </h3>

                <p>
                  Keep track of every application in one place.
                </p>

              </div>

              <span className="action-arrow">
                ↗
              </span>

            </Link>


            <Link
              to="/my-resumes"
              className="quick-action-card"
            >

              <div className="quick-card-icon">
                ◧
              </div>

              <div className="quick-card-content">

                <span className="quick-card-number">
                  03
                </span>

                <h3>
                  My Resumes
                </h3>

                <p>
                  Manage your resumes and keep them job-ready.
                </p>

              </div>

              <span className="action-arrow">
                ↗
              </span>

            </Link>


            <Link
              to="/jobs"
              className="quick-action-card"
            >

              <div className="quick-card-icon">
                ↗
              </div>

              <div className="quick-card-content">

                <span className="quick-card-number">
                  04
                </span>

                <h3>
                  Apply Now
                </h3>

                <p>
                  Discover new roles and take your next step.
                </p>

              </div>

              <span className="action-arrow">
                ↗
              </span>

            </Link>

          </div>

        </section>


        {/* ======================================
            RECENT APPLICATIONS
        ====================================== */}

        <section className="dashboard-section applications-section">

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                APPLICATION ACTIVITY
              </span>

              <h2>
                Recent Applications
              </h2>

              <p>
                Your latest application activity at a glance.
              </p>

            </div>

            {applications.length > 0 && (
              <Link
                to="/applications"
                className="view-all-link"
              >
                View all
                <span>↗</span>
              </Link>
            )}

          </div>


          {recentApplications.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-visual">
                <div className="empty-icon">
                  ◫
                </div>
              </div>

              <span className="empty-kicker">
                READY WHEN YOU ARE
              </span>

              <h3>
                No applications yet
              </h3>

              <p>
                Your career journey starts with the first
                application. Explore opportunities and
                find your next role.
              </p>

              <Link
                to="/jobs"
                className="dashboard-primary-btn"
              >
                <span>Explore Jobs</span>
                <span>→</span>
              </Link>

            </div>

          ) : (

            <div className="recent-applications">

              {recentApplications.map(
                (application, index) => (

                  <div
                    className="recent-application-card"
                    key={application.id}
                  >

                    <div className="application-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="application-job-icon">
                      💼
                    </div>


                    <div className="application-info">

                      <h3>
                        {application.job_title}
                      </h3>

                      <p>
                        {application.company_name}
                      </p>

                      <span className="application-date">
                        Applied{" "}
                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </span>

                    </div>


                    <div className="application-right">

                      <span
                        className={`dashboard-status status-${application.status?.toLowerCase()}`}
                      >
                        <span>
                          {getStatusIcon(application.status)}
                        </span>

                        {getStatusLabel(application.status)}
                      </span>

                      <Link
                        to={`/jobs/${application.job}`}
                        className="view-job-link"
                      >
                        View Job
                        <span>↗</span>
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ======================================
            CAREER TIP
        ====================================== */}

        <section className="career-tip">

          <div className="career-tip-glow"></div>

          <div className="career-tip-icon">
            ✦
          </div>

          <div className="career-tip-content">

            <span>
              HIRESHERE INSIGHT
            </span>

            <h3>
              Keep your job search active
            </h3>

            <p>
              New opportunities appear every day.
              Keep your profile and resume updated,
              and apply to roles that match your skills.
            </p>

          </div>

          <Link
            to="/jobs"
            className="tip-link"
          >
            Explore Jobs
            <span>→</span>
          </Link>

        </section>

      </div>

    </div>
  );
}

export default JobSeekerDashboard;