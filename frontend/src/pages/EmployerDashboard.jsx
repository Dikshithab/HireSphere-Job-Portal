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
            api.get("/jobs/employer"),
            api.get("/applications/employer")
          ]);

        console.log(
          "Employer Jobs:",
          jobsResponse.data
        );

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

        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
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
    (job) =>
      job.active === true ||
      job.status === "ACTIVE" ||
      job.status === "OPEN"
  ).length;

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "PENDING"
    ).length;

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status === "SHORTLISTED"
    ).length;

  const hiredApplications =
    applications.filter(
      (application) =>
        application.status === "HIRED"
    ).length;


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="employer-dashboard">

        <div className="dashboard-loading">

          <div className="dashboard-spinner"></div>

          <h2>
            Loading Dashboard
          </h2>

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

        <div className="dashboard-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (

    <div className="employer-dashboard">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-eyebrow">
            EMPLOYER PORTAL
          </span>

          <h1>
            Employer Dashboard
          </h1>

          <p>
            Manage your job postings and track
            candidates from one place.
          </p>

        </div>

        <Link
          to="/create-job"
          className="dashboard-post-btn"
        >
          <span>＋</span>
          Post New Job
        </Link>

      </div>


      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="dashboard-stats">

        {/* TOTAL JOBS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            💼
          </div>

          <div className="stat-content">

            <span>
              Total Jobs
            </span>

            <strong>
              {totalJobs}
            </strong>

            <small>
              Job postings
            </small>

          </div>

        </div>


        {/* ACTIVE JOBS */}

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div className="stat-content">

            <span>
              Active Jobs
            </span>

            <strong>
              {activeJobs}
            </strong>

            <small>
              Currently active
            </small>

          </div>

        </div>


        {/* APPLICATIONS */}

        <div className="stat-card">

          <div className="stat-icon purple">
            👥
          </div>

          <div className="stat-content">

            <span>
              Applications
            </span>

            <strong>
              {totalApplications}
            </strong>

            <small>
              Candidates received
            </small>

          </div>

        </div>


        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-icon orange">
            ⏳
          </div>

          <div className="stat-content">

            <span>
              Pending
            </span>

            <strong>
              {pendingApplications}
            </strong>

            <small>
              Need review
            </small>

          </div>

        </div>

      </div>


      {/* =====================================
          SECONDARY STATISTICS
      ===================================== */}

      <div className="secondary-stats">

        <div className="secondary-stat">

          <span className="secondary-icon shortlisted">
            ★
          </span>

          <div>

            <span>
              Shortlisted
            </span>

            <strong>
              {shortlistedApplications}
            </strong>

          </div>

        </div>


        <div className="secondary-stat">

          <span className="secondary-icon hired">
            ✓
          </span>

          <div>

            <span>
              Hired
            </span>

            <strong>
              {hiredApplications}
            </strong>

          </div>

        </div>


        <div className="secondary-stat">

          <span className="secondary-icon conversion">
            %
          </span>

          <div>

            <span>
              Hiring Rate
            </span>

            <strong>

              {totalApplications > 0
                ? Math.round(
                    (hiredApplications /
                      totalApplications) *
                      100
                  )
                : 0
              }%

            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          QUICK ACTIONS
      ===================================== */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>

            <span className="section-eyebrow">
              QUICK ACTIONS
            </span>

            <h2>
              Manage your recruitment
            </h2>

          </div>

        </div>


        <div className="quick-actions">

          <Link
            to="/create-job"
            className="quick-action-card"
          >

            <div className="quick-action-icon blue">
              ＋
            </div>

            <div>

              <h3>
                Post a Job
              </h3>

              <p>
                Create a new job opportunity.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>


          <Link
            to="/employer/jobs"
            className="quick-action-card"
          >

            <div className="quick-action-icon purple">
              💼
            </div>

            <div>

              <h3>
                Manage Jobs
              </h3>

              <p>
                Edit and manage your postings.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>


          <Link
            to="/employer/applications"
            className="quick-action-card"
          >

            <div className="quick-action-icon green">
              👥
            </div>

            <div>

              <h3>
                Applications
              </h3>

              <p>
                Review and manage candidates.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>


          <Link
            to="/company"
            className="quick-action-card"
          >

            <div className="quick-action-icon orange">
              🏢
            </div>

            <div>

              <h3>
                Company Profile
              </h3>

              <p>
                Manage your company information.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </Link>

        </div>

      </div>


      {/* =====================================
          RECENT JOBS + APPLICATIONS
      ===================================== */}

      <div className="dashboard-grid">


        {/* =================================
            RECENT JOBS
        ================================= */}

        <div className="dashboard-panel">

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
            </Link>

          </div>


          {jobs.length === 0 ? (

            <div className="panel-empty">

              <div>
                💼
              </div>

              <h3>
                No jobs posted
              </h3>

              <p>
                Start by creating your first job.
              </p>

              <Link
                to="/create-job"
                className="empty-action"
              >
                Post a Job
              </Link>

            </div>

          ) : (

            <div className="recent-list">

              {jobs
                .slice(0, 5)
                .map((job) => (

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
                        {job.location ||
                          "Location not specified"}
                      </p>

                    </div>

                    <div className="recent-job-meta">

                      <span
                        className={
                          job.active === false
                            ? "job-status closed"
                            : "job-status active"
                        }
                      >
                        {job.active === false
                          ? "Closed"
                          : "Active"}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>


        {/* =================================
            RECENT APPLICATIONS
        ================================= */}

        <div className="dashboard-panel">

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
            </Link>

          </div>


          {applications.length === 0 ? (

            <div className="panel-empty">

              <div>
                👥
              </div>

              <h3>
                No applications
              </h3>

              <p>
                Applications will appear here.
              </p>

            </div>

          ) : (

            <div className="recent-list">

              {applications
                .slice(0, 5)
                .map((application) => (

                  <div
                    className="recent-application"
                    key={application.id}
                  >

                    <div className="applicant-avatar">

                      {application.applicantName
                        ? application.applicantName
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>

                    <div className="application-info">

                      <h3>
                        {application.applicantName ||
                          "Applicant"}
                      </h3>

                      <p>
                        {application.jobTitle ||
                          "Job Application"}
                      </p>

                    </div>

                    <span
                      className={`status status-${
                        application.status
                          ?.toLowerCase()
                      }`}
                    >
                      {application.status}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default EmployerDashboard;