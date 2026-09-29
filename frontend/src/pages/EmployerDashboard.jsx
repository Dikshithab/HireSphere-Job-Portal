import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/EmployerDashboard.css";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsResponse, applicationsResponse] =
          await Promise.all([
            api.get("/jobs/"),
            api.get("/applications/employer/"),
          ]);

        console.log("Employer Jobs:", jobsResponse.data);
        console.log(
          "Employer Applications:",
          applicationsResponse.data
        );

        setJobs(
          Array.isArray(jobsResponse.data)
            ? jobsResponse.data
            : []
        );

        setApplications(
          Array.isArray(applicationsResponse.data)
            ? applicationsResponse.data
            : []
        );
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (job) => job.status === "ACTIVE"
  ).length;

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

  const hiringRate =
    totalApplications > 0
      ? Math.round(
          (hiredApplications / totalApplications) * 100
        )
      : 0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="employer-dashboard">
        <div className="dashboard-bg-orb dashboard-orb-one" />
        <div className="dashboard-bg-orb dashboard-orb-two" />
        <div className="dashboard-bg-grid" />

        <div className="dashboard-loading">
          <div className="dashboard-loading-icon">
            ✦
          </div>

          <div className="dashboard-spinner" />

          <h2>Loading your workspace</h2>

          <p>
            Fetching your jobs and applications...
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
      <div className="employer-dashboard">
        <div className="dashboard-bg-orb dashboard-orb-one" />
        <div className="dashboard-bg-orb dashboard-orb-two" />
        <div className="dashboard-bg-grid" />

        <div className="dashboard-error">
          <div className="error-icon">!</div>

          <span className="error-eyebrow">
            WORKSPACE ERROR
          </span>

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button
            className="dashboard-retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
            <span>↻</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="employer-dashboard">
      {/* BACKGROUND */}

      <div className="dashboard-bg-orb dashboard-orb-one" />
      <div className="dashboard-bg-orb dashboard-orb-two" />
      <div className="dashboard-bg-orb dashboard-orb-three" />
      <div className="dashboard-bg-grid" />

      <div className="dashboard-container">
        {/* =====================================
            HEADER
        ===================================== */}

        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-eyebrow">
              <span className="eyebrow-dot" />
              EMPLOYER WORKSPACE
            </div>

            <h1>
              Manage your{" "}
              <span>talent pipeline.</span>
            </h1>

            <p>
              Manage your job postings, review candidates,
              and build your team from one intelligent
              workspace.
            </p>
          </div>

          <Link
            to="/create-job"
            className="dashboard-post-btn"
          >
            <span className="post-btn-icon">＋</span>

            <span>Post New Job</span>

            <span className="post-btn-arrow">→</span>
          </Link>
        </header>

        {/* =====================================
            TOP STATUS STRIP
        ===================================== */}

        <div className="dashboard-status-strip">
          <div className="status-strip-icon">
            ✦
          </div>

          <div className="status-strip-content">
            <strong>
              Your recruitment workspace is active
            </strong>

            <span>
              {activeJobs} active{" "}
              {activeJobs === 1 ? "position" : "positions"}{" "}
              are currently visible to candidates.
            </span>
          </div>

          <div className="status-strip-live">
            <span />
            LIVE
          </div>
        </div>

        {/* =====================================
            MAIN STATISTICS
        ===================================== */}

        <section className="dashboard-stats">
          {/* TOTAL JOBS */}

          <div className="stat-card stat-blue">
            <div className="stat-card-top">
              <div className="stat-icon">
                💼
              </div>

              <span className="stat-trend">
                ↗
              </span>
            </div>

            <div className="stat-content">
              <span>Total Jobs</span>

              <strong>{totalJobs}</strong>

              <small>
                Job postings
              </small>
            </div>
          </div>

          {/* ACTIVE JOBS */}

          <div className="stat-card stat-green">
            <div className="stat-card-top">
              <div className="stat-icon">
                ✓
              </div>

              <span className="stat-live-dot">
                ●
              </span>
            </div>

            <div className="stat-content">
              <span>Active Jobs</span>

              <strong>{activeJobs}</strong>

              <small>
                Currently active
              </small>
            </div>
          </div>

          {/* APPLICATIONS */}

          <div className="stat-card stat-purple">
            <div className="stat-card-top">
              <div className="stat-icon">
                👥
              </div>

              <span className="stat-trend">
                ↗
              </span>
            </div>

            <div className="stat-content">
              <span>Applications</span>

              <strong>
                {totalApplications}
              </strong>

              <small>
                Candidates received
              </small>
            </div>
          </div>

          {/* PENDING */}

          <div className="stat-card stat-orange">
            <div className="stat-card-top">
              <div className="stat-icon">
                ⏳
              </div>

              {pendingApplications > 0 && (
                <span className="pending-dot">
                  {pendingApplications}
                </span>
              )}
            </div>

            <div className="stat-content">
              <span>Pending Review</span>

              <strong>
                {pendingApplications}
              </strong>

              <small>
                Need your attention
              </small>
            </div>
          </div>
        </section>

        {/* =====================================
            SECONDARY STATS
        ===================================== */}

        <section className="secondary-stats">
          <div className="secondary-stat">
            <div className="secondary-stat-icon shortlisted">
              ★
            </div>

            <div>
              <span>Shortlisted</span>

              <strong>
                {shortlistedApplications}
              </strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat">
            <div className="secondary-stat-icon hired">
              ✓
            </div>

            <div>
              <span>Hired</span>

              <strong>
                {hiredApplications}
              </strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat">
            <div className="secondary-stat-icon conversion">
              %
            </div>

            <div>
              <span>Hiring Rate</span>

              <strong>
                {hiringRate}%
              </strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat secondary-stat-insight">
            <div className="insight-icon">
              ✦
            </div>

            <div>
              <span>Workspace</span>

              <strong>Active</strong>
            </div>
          </div>
        </section>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">
                QUICK ACTIONS
              </span>

              <h2>
                Manage your recruitment
              </h2>

              <p>
                Everything you need to keep your hiring
                workflow moving.
              </p>
            </div>
          </div>

          <div className="quick-actions">
            {/* POST JOB */}

            <Link
              to="/create-job"
              className="quick-action-card quick-blue"
            >
              <div className="quick-action-icon">
                ＋
              </div>

              <div className="quick-action-content">
                <span className="quick-action-number">
                  01
                </span>

                <h3>
                  Post a Job
                </h3>

                <p>
                  Create a new opportunity and start
                  attracting candidates.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

            {/* MANAGE JOBS */}

            <Link
              to="/employer/jobs"
              className="quick-action-card quick-purple"
            >
              <div className="quick-action-icon">
                💼
              </div>

              <div className="quick-action-content">
                <span className="quick-action-number">
                  02
                </span>

                <h3>
                  Manage Jobs
                </h3>

                <p>
                  Edit, monitor and manage your current
                  job postings.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

            {/* APPLICATIONS */}

            <Link
              to="/employer/applications"
              className="quick-action-card quick-green"
            >
              <div className="quick-action-icon">
                👥
              </div>

              <div className="quick-action-content">
                <span className="quick-action-number">
                  03
                </span>

                <h3>
                  Applications
                </h3>

                <p>
                  Review candidates and move them through
                  your hiring pipeline.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

            {/* COMPANY */}

            <Link
              to="/company"
              className="quick-action-card quick-orange"
            >
              <div className="quick-action-icon">
                🏢
              </div>

              <div className="quick-action-content">
                <span className="quick-action-number">
                  04
                </span>

                <h3>
                  Company Profile
                </h3>

                <p>
                  Keep your organization information
                  updated for candidates.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* =====================================
            RECENT DATA
        ===================================== */}

        <div className="dashboard-grid">
          {/* ===================================
              RECENT JOBS
          =================================== */}

          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">
                  JOB POSTINGS
                </span>

                <h2>
                  Recent Jobs
                </h2>
              </div>

              <Link
                to="/employer/jobs"
                className="view-all"
              >
                View All
                <span>→</span>
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="panel-empty">
                <div className="empty-panel-icon">
                  💼
                </div>

                <h3>
                  No jobs posted yet
                </h3>

                <p>
                  Start building your talent pipeline by
                  creating your first job.
                </p>

                <Link
                  to="/create-job"
                  className="empty-action"
                >
                  <span>＋</span>
                  Post a Job
                </Link>
              </div>
            ) : (
              <div className="recent-list">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    className="recent-job"
                    key={job.id}
                  >
                    <div className="recent-job-icon">
                      💼
                    </div>

                    <div className="recent-job-info">
                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        <span>◎</span>
                        {job.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <div className="recent-job-meta">
                      <span
                        className={
                          job.status === "ACTIVE"
                            ? "job-status active"
                            : "job-status closed"
                        }
                      >
                        <span className="status-dot" />

                        {job.status === "ACTIVE"
                          ? "Active"
                          : "Closed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===================================
              RECENT APPLICATIONS
          =================================== */}

          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">
                  CANDIDATES
                </span>

                <h2>
                  Recent Applications
                </h2>
              </div>

              <Link
                to="/employer/applications"
                className="view-all"
              >
                View All
                <span>→</span>
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="panel-empty">
                <div className="empty-panel-icon">
                  👥
                </div>

                <h3>
                  No applications yet
                </h3>

                <p>
                  New candidate applications will appear
                  here automatically.
                </p>
              </div>
            ) : (
              <div className="recent-list">
                {applications
                  .slice(0, 5)
                  .map((application) => {
                    const applicantName =
                      application.applicant_name ||
                      application.applicant?.name ||
                      "Applicant";

                    return (
                      <div
                        className="recent-application"
                        key={application.id}
                      >
                        <div className="applicant-avatar">
                          {applicantName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="application-info">
                          <h3>
                            {applicantName}
                          </h3>

                          <p>
                            {application.job_title ||
                              "Job Application"}
                          </p>
                        </div>

                        <span
                          className={`status status-${application.status?.toLowerCase()}`}
                        >
                          {application.status}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        </div>

        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="dashboard-footer">
          <span>✦</span>

          <span>
            HireSphere employer workspace
          </span>

          <span className="footer-dot">
            •
          </span>

          <span>
            Your next great hire starts here.
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;