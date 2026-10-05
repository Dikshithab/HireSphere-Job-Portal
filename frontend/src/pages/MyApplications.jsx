import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/MyApplication.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MY APPLICATIONS
  // ==========================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/applications/my/");

        console.log("My Applications Response:", response.data);

        // New backend response:
        // {
        //   count: 2,
        //   applications: [...]
        // }

        const applicationData = Array.isArray(response.data)
          ? response.data
          : response.data.applications || [];

        const formattedApplications = applicationData.map(
          (application) => ({
            ...application,
            jobId: application.job,
            jobTitle: application.job_title,
            companyName: application.company_name,
            appliedAt: application.applied_at,
          })
        );

        setApplications(formattedApplications);

      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ==========================================
  // STATUS HELPERS
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "◷";

      case "SHORTLISTED":
        return "✦";

      case "REJECTED":
        return "×";

      case "HIRED":
        return "✓";

      default:
        return "•";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Under Review";

      case "SHORTLISTED":
        return "Shortlisted";

      case "REJECTED":
        return "Not Selected";

      case "HIRED":
        return "Hired";

      default:
        return status || "Unknown";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "PENDING":
        return "Your application is currently under review.";

      case "SHORTLISTED":
        return "Great news! You've been shortlisted.";

      case "REJECTED":
        return "This application was not selected.";

      case "HIRED":
        return "Congratulations! You have been hired.";

      default:
        return "Application status updated.";
    }
  };

  // ==========================================
  // DATE FORMATTER
  // ==========================================

  const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalApplications = applications.length;

  const pendingCount = applications.filter(
    (application) =>
      application.status === "PENDING"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === "SHORTLISTED"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "REJECTED"
  ).length;

  const hiredCount = applications.filter(
    (application) =>
      application.status === "HIRED"
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applications-page">

        <div className="applications-bg-grid"></div>

        <div className="applications-orb applications-orb-one"></div>
        <div className="applications-orb applications-orb-two"></div>

        <div className="applications-loading">

          <div className="applications-loading-ring">
            <span>✦</span>
          </div>

          <span className="loading-label">
            HIRESHERE
          </span>

          <h2>
            Loading your applications
          </h2>

          <p>
            Preparing your application workspace...
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
      <div className="applications-page">

        <div className="applications-bg-grid"></div>

        <div className="applications-orb applications-orb-one"></div>
        <div className="applications-orb applications-orb-two"></div>

        <div className="applications-error-state">

          <div className="error-state-icon">
            !
          </div>

          <span className="error-label">
            APPLICATIONS UNAVAILABLE
          </span>

          <h1>
            Something went wrong
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/jobs"
            className="browse-jobs-btn"
          >
            <span>Browse Jobs</span>
            <span>→</span>
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="applications-page">

      {/* BACKGROUND */}

      <div className="applications-bg-grid"></div>

      <div className="applications-orb applications-orb-one"></div>
      <div className="applications-orb applications-orb-two"></div>
      <div className="applications-orb applications-orb-three"></div>


      <div className="applications-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="applications-header">

          <div className="applications-header-content">

            <div className="applications-eyebrow">

              <span className="eyebrow-dot"></span>

              CAREER WORKSPACE

              <span className="ai-badge">
                AI POWERED
              </span>

            </div>

            <h1>
              My{" "}
              <span className="gradient-text">
                Applications.
              </span>
            </h1>

            <p>
              Track every opportunity you've applied
              for and stay updated throughout your
              job search journey.
            </p>

          </div>

          <Link
            to="/jobs"
            className="browse-jobs-btn header-browse-btn"
          >
            <span className="search-icon">
              ⌕
            </span>

            <span>
              Find More Jobs
            </span>

            <span>
              →
            </span>
          </Link>

        </header>


        {/* =====================================
            STATISTICS
        ===================================== */}

        {applications.length > 0 && (

          <section className="application-stats">

            {/* TOTAL */}

            <div className="application-stat-card">

              <div className="application-stat-icon total">
                ◫
              </div>

              <div>
                <span>Total</span>

                <strong>
                  {totalApplications}
                </strong>
              </div>

            </div>


            {/* PENDING */}

            <div className="application-stat-card">

              <div className="application-stat-icon pending">
                ◷
              </div>

              <div>
                <span>Under Review</span>

                <strong>
                  {pendingCount}
                </strong>
              </div>

            </div>


            {/* SHORTLISTED */}

            <div className="application-stat-card">

              <div className="application-stat-icon shortlisted">
                ✦
              </div>

              <div>
                <span>Shortlisted</span>

                <strong>
                  {shortlistedCount}
                </strong>
              </div>

            </div>


            {/* REJECTED */}

            <div className="application-stat-card">

              <div className="application-stat-icon rejected">
                ×
              </div>

              <div>
                <span>Rejected</span>

                <strong>
                  {rejectedCount}
                </strong>
              </div>

            </div>


            {/* HIRED */}

            <div className="application-stat-card">

              <div className="application-stat-icon hired">
                ✓
              </div>

              <div>
                <span>Hired</span>

                <strong>
                  {hiredCount}
                </strong>
              </div>

            </div>

          </section>

        )}


        {/* =====================================
            NO APPLICATIONS
        ===================================== */}

        {applications.length === 0 ? (

          <section className="no-applications">

            <div className="empty-glow"></div>

            <div className="empty-application-icon">
              ◫
            </div>

            <span className="empty-label">
              YOUR CAREER JOURNEY
            </span>

            <h2>
              No applications yet
            </h2>

            <p>
              You haven't applied for any jobs yet.
              Explore opportunities and take the first
              step toward your next career move.
            </p>

            <Link
              to="/jobs"
              className="browse-jobs-btn empty-browse-btn"
            >
              <span>⌕</span>
              Browse Jobs
              <span>→</span>
            </Link>

          </section>

        ) : (

          /* ===================================
             APPLICATION LIST
          =================================== */

          <section className="applications-section">

            <div className="applications-section-header">

              <div>

                <span className="section-kicker">
                  APPLICATION ACTIVITY
                </span>

                <h2>
                  Your Applications
                </h2>

              </div>

              <span className="application-count">
                {totalApplications}{" "}
                {totalApplications === 1
                  ? "application"
                  : "applications"}
              </span>

            </div>


            <div className="applications-list">

              {applications.map(
                (application, index) => (

                  <article
                    className="application-card"
                    key={application.id}
                  >

                    {/* CARD NUMBER */}

                    <div className="application-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>


                    {/* JOB ICON */}

                    <div className="application-job-icon">
                      <span>💼</span>
                    </div>


                    {/* APPLICATION DETAILS */}

                    <div className="application-main">

                      <h2>
                        {application.jobTitle}
                      </h2>

                      <h3>
                        <span>◈</span>
                        {application.companyName}
                      </h3>


                      <div className="application-meta">

                        <span>
                          <b>⌖</b>
                          {application.location || "N/A"}
                        </span>

                        <span>
                          <b>◷</b>

                          Applied{" "}
                          {formatDate(
                            application.appliedAt
                          )}
                        </span>

                        {application.job_type && (
                          <span>
                            <b>▣</b>
                            {application.job_type}
                          </span>
                        )}

                      </div>


                      {/* =================================
                          APPLICATION TIMELINE
                      ================================= */}

                      {application.timeline &&
                        application.timeline.length > 0 && (

                          <div className="application-timeline">

                            <div className="timeline-title">
                              APPLICATION TIMELINE
                            </div>

                            <div className="timeline">

                              {application.timeline.map(
                                (event, timelineIndex) => (

                                  <div
                                    className={`timeline-item ${
                                      event.completed
                                        ? "completed"
                                        : ""
                                    }`}
                                    key={`${application.id}-${event.status}-${timelineIndex}`}
                                  >

                                    <div className="timeline-marker">
                                      {event.completed
                                        ? "✓"
                                        : "○"}
                                    </div>

                                    <div className="timeline-content">

                                      <strong>
                                        {event.label}
                                      </strong>

                                      {event.date && (
                                        <span>
                                          {formatDate(
                                            event.date
                                          )}
                                        </span>
                                      )}

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>


                    {/* STATUS */}

                    <div className="application-status">

                      <div
                        className={`status status-${application.status?.toLowerCase()}`}
                      >

                        <span className="status-icon">
                          {getStatusIcon(
                            application.status
                          )}
                        </span>

                        {getStatusText(
                          application.status
                        )}

                      </div>


                      <p>
                        {getStatusMessage(
                          application.status
                        )}
                      </p>


                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="view-application-btn"
                      >
                        <span>
                          View Job
                        </span>

                        <span>
                          ↗
                        </span>
                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}


        {/* =====================================
            BOTTOM CAREER CTA
        ===================================== */}

        {applications.length > 0 && (

          <section className="applications-cta">

            <div className="cta-glow"></div>

            <div className="cta-icon">
              ✦
            </div>

            <div className="cta-content">

              <span>
                KEEP MOVING FORWARD
              </span>

              <h3>
                Your next opportunity could be one
                search away.
              </h3>

              <p>
                Discover new jobs that match your
                skills and career goals.
              </p>

            </div>

            <Link
              to="/jobs"
              className="cta-jobs-btn"
            >
              Explore Jobs
              <span>→</span>
            </Link>

          </section>

        )}

      </div>

    </div>
  );
}

export default MyApplications;
