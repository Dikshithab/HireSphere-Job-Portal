import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/SavedJobs.css";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs/saved/");

      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);

      if (error.response?.status === 401) {
        setError("Please login to view your saved jobs.");
      } else {
        setError("Unable to load saved jobs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save/`);

      setSavedJobs((prev) =>
        prev.filter((job) => job.id !== jobId)
      );
    } catch (error) {
      console.error("Error removing saved job:", error);
      alert("Unable to remove saved job.");
    }
  };

  if (loading) {
    return (
      <div className="saved-jobs-page">
        <div className="saved-jobs-loading">
          <div className="saved-spinner"></div>
          <h2>Loading saved jobs...</h2>
          <p>Fetching your saved opportunities.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-jobs-page">
        <div className="saved-jobs-error">
          <div className="saved-error-icon">!</div>

          <h2>{error}</h2>

          <Link to="/login" className="saved-login-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-jobs-page">

      <div className="saved-bg-orb saved-orb-one"></div>
      <div className="saved-bg-orb saved-orb-two"></div>
      <div className="saved-bg-grid"></div>

      <main className="saved-jobs-container">

        {/* HEADER */}

        <section className="saved-jobs-header">

          <div className="saved-eyebrow">
            <span></span>
            YOUR CAREER COLLECTION
          </div>

          <h1>
            My <span>Saved Jobs</span>
          </h1>

          <p>
            Keep track of opportunities you're
            interested in and come back to them anytime.
          </p>

          <div className="saved-count">
            <strong>{savedJobs.length}</strong>
            <span>
              {savedJobs.length === 1
                ? "saved opportunity"
                : "saved opportunities"}
            </span>
          </div>

        </section>

        {/* EMPTY STATE */}

        {savedJobs.length === 0 ? (

          <section className="saved-empty">

            <div className="saved-empty-icon">
              ♡
            </div>

            <span className="saved-empty-label">
              YOUR COLLECTION IS EMPTY
            </span>

            <h2>
              No saved jobs yet
            </h2>

            <p>
              When you find a job you're interested in,
              save it here so you can easily find it later.
            </p>

            <Link
              to="/jobs"
              className="browse-jobs-btn"
            >
              Browse Jobs →
            </Link>

          </section>

        ) : (

          /* JOBS */

          <section className="saved-jobs-grid">

            {savedJobs.map((job) => (

              <article
                className="saved-job-card"
                key={job.id}
              >

                {/* CARD HEADER */}

                <div className="saved-card-header">

                  <div className="saved-company-avatar">
                    {job.company_name
                      ?.charAt(0)
                      .toUpperCase() || "J"}
                  </div>

                  <div>
                    <h2>{job.title}</h2>

                    <p>
                      {job.company_name}
                    </p>
                  </div>

                </div>

                {/* BADGES */}

                <div className="saved-job-badges">

                  <span className="saved-job-type">
                    {job.job_type}
                  </span>

                  {job.remote && (
                    <span className="saved-remote">
                      ◉ Remote
                    </span>
                  )}

                </div>

                {/* DETAILS */}

                <div className="saved-job-details">

                  <div>
                    <small>LOCATION</small>
                    <p>
                      ⌖ {job.location || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <small>SALARY</small>
                    <p>
                      ₹
                      {job.salary
                        ? Number(job.salary).toLocaleString(
                            "en-IN"
                          )
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <small>EXPERIENCE</small>
                    <p>
                      ◆ {job.experience_level ||
                        "Not specified"}
                    </p>
                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="saved-job-description">
                  {job.description}
                </p>

                {/* FOOTER */}

                <div className="saved-job-footer">

                  <button
                    type="button"
                    className="remove-saved-btn"
                    onClick={() =>
                      removeSavedJob(job.id)
                    }
                  >
                    ♥ Saved
                  </button>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="saved-view-btn"
                  >
                    View Opportunity →
                  </Link>

                </div>

              </article>

            ))}

          </section>

        )}

      </main>
    </div>
  );
}

export default SavedJobs;