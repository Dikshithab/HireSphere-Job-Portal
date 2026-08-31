import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/JobSeekerDashboard.css";

function JobSeekerDashboard() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userName =
    localStorage.getItem("userName") || "Job Seeker";


  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const response = await api.get(
          "/applications/my"
        );

        console.log(
          "Dashboard Applications:",
          response.data
        );

        setApplications(response.data);

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchApplications();

  }, []);


  // ==========================================
  // STATISTICS
  // ==========================================

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
  // RECENT APPLICATIONS
  // ==========================================

  const recentApplications =
    [...applications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt) -
          new Date(a.appliedAt)
      )
      .slice(0, 5);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="seeker-dashboard">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading dashboard...
          </h2>

          <p>
            Please wait while we load your applications.
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

          <Link
            to="/jobs"
            className="dashboard-primary-btn"
          >
            Browse Jobs
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

      {/* ======================================
          WELCOME HEADER
      ====================================== */}

      <section className="dashboard-welcome">

        <div>

          <span className="dashboard-eyebrow">
            JOB SEEKER DASHBOARD
          </span>

          <h1>
            Welcome back, {userName} 👋
          </h1>

          <p>
            Track your applications and discover
            your next career opportunity.
          </p>

        </div>

        <Link
          to="/jobs"
          className="dashboard-primary-btn"
        >
          🔎 Find Jobs
        </Link>

      </section>


      {/* ======================================
          STATISTICS
      ====================================== */}

      <section className="dashboard-stats">

        {/* TOTAL */}

        <div className="stat-card">

          <div className="stat-icon total-icon">
            📄
          </div>

          <div>

            <span>
              Total Applications
            </span>

            <strong>
              {totalApplications}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-icon pending-icon">
            ⏳
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingApplications}
            </strong>

          </div>

        </div>


        {/* SHORTLISTED */}

        <div className="stat-card">

          <div className="stat-icon shortlisted-icon">
            ⭐
          </div>

          <div>

            <span>
              Shortlisted
            </span>

            <strong>
              {shortlistedApplications}
            </strong>

          </div>

        </div>


        {/* HIRED */}

        <div className="stat-card">

          <div className="stat-icon hired-icon">
            🎉
          </div>

          <div>

            <span>
              Hired
            </span>

            <strong>
              {hiredApplications}
            </strong>

          </div>

        </div>

      </section>


      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your job search
            </p>

          </div>

        </div>


                <div className="quick-actions">

          <Link
            to="/jobs"
            className="quick-action-card"
          >
            <div className="quick-action-icon">
              🔎
            </div>

            <div>
              <h3>
                Find Jobs
              </h3>

              <p>
                Search for new opportunities
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </Link>


          <Link
            to="/applications"
            className="quick-action-card"
          >
            <div className="quick-action-icon">
              📋
            </div>

            <div>
              <h3>
                My Applications
              </h3>

              <p>
                Track all your applications
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </Link>


          <Link
            to="/my-resumes"
            className="quick-action-card"
          >
            <div className="quick-action-icon">
              📄
            </div>

            <div>
              <h3>
                My Resumes
              </h3>

              <p>
                View and manage your resumes
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </Link>


          <Link
            to="/jobs"
            className="quick-action-card"
          >
            <div className="quick-action-icon">
              🚀
            </div>

            <div>
              <h3>
                Apply Now
              </h3>

              <p>
                Explore the latest jobs
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </Link>

        </div>

      </section>


      {/* ======================================
          RECENT APPLICATIONS
      ====================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Recent Applications
            </h2>

            <p>
              Your latest job applications
            </p>

          </div>

          {applications.length > 0 && (

            <Link
              to="/applications"
              className="view-all-link"
            >
              View All →
            </Link>

          )}

        </div>


        {recentApplications.length === 0 ? (

          <div className="empty-dashboard">

            <div className="empty-icon">
              📄
            </div>

            <h3>
              No applications yet
            </h3>

            <p>
              Start applying to jobs and track
              your progress here.
            </p>

            <Link
              to="/jobs"
              className="dashboard-primary-btn"
            >
              Browse Jobs
            </Link>

          </div>

        ) : (

          <div className="recent-applications">

            {recentApplications.map(
              (application) => (

                <div
                  className="recent-application-card"
                  key={application.id}
                >

                  <div className="application-job-icon">
                    💼
                  </div>


                  <div className="application-info">

                    <h3>
                      {application.jobTitle}
                    </h3>

                    <p>
                      {application.companyName}
                    </p>

                    <span>
                      Applied on{" "}
                      {application.appliedAt
                        ? new Date(
                            application.appliedAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}
                    </span>

                  </div>


                  <div className="application-right">

                    <span
                      className={`dashboard-status status-${application.status?.toLowerCase()}`}
                    >
                      {application.status}
                    </span>

                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="view-job-link"
                    >
                      View Job
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

        <div className="career-tip-icon">
          💡
        </div>

        <div>

          <h3>
            Keep your job search active
          </h3>

          <p>
            Check new job postings regularly and
            apply to positions that match your skills.
          </p>

        </div>

        <Link
          to="/jobs"
          className="tip-link"
        >
          Explore Jobs →
        </Link>

      </section>

    </div>
    

  );
}
export default JobSeekerDashboard;