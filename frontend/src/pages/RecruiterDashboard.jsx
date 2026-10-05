import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/RecruiterDashboard.css";

function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/applications/recruiter-dashboard/"
        );

        setDashboard(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.error ||
            "Unable to load recruiter dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="recruiter-dashboard">
        <div className="dashboard-loading">
          Loading recruiter dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruiter-dashboard">
        <div className="dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard">

      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            HIRESPHERE
          </span>

          <h1>Recruiter Dashboard</h1>

          <p>
            Track your jobs and manage candidate applications.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <span>💼</span>
          <div>
            <small>Total Jobs</small>
            <strong>{dashboard.total_jobs}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>📄</span>
          <div>
            <small>Total Applications</small>
            <strong>{dashboard.total_applications}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>⏳</span>
          <div>
            <small>Pending</small>
            <strong>{dashboard.pending}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>⭐</span>
          <div>
            <small>Shortlisted</small>
            <strong>{dashboard.shortlisted}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>❌</span>
          <div>
            <small>Rejected</small>
            <strong>{dashboard.rejected}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>🎉</span>
          <div>
            <small>Hired</small>
            <strong>{dashboard.hired}</strong>
          </div>
        </div>

      </div>

      {/* JOB STATISTICS */}

      <div className="job-statistics">

        <div className="section-header">
          <div>
            <span>APPLICATION OVERVIEW</span>
            <h2>Job-wise Applications</h2>
          </div>
        </div>

        {dashboard.job_statistics?.length === 0 ? (
          <div className="empty-dashboard">
            No jobs posted yet.
          </div>
        ) : (
          <div className="job-stat-list">

            {dashboard.job_statistics.map((job) => (

              <div
                className="job-stat-row"
                key={job.id}
              >
                <div>
                  <h3>{job.title}</h3>
                  <p>
                    {job.application_count} application
                    {job.application_count !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <div className="application-count">
                  {job.application_count}
                </div>
              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default RecruiterDashboard;