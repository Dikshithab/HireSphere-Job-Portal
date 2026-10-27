import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  IndianRupee,
  GraduationCap,
  ArrowRight,
  AlertTriangle,
  Briefcase,
  Building2,
  Sparkles
} from "lucide-react";
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
      setSavedJobs(Array.isArray(response.data) ? response.data : []);
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
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
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
          <p>Retrieving your shortlisted opportunities.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-jobs-page">
        <div className="saved-jobs-error">
          <div className="saved-error-icon">
            <AlertTriangle size={24} />
          </div>
          <h2>{error}</h2>
          <Link to="/login" className="saved-login-btn">
            Sign In to Continue
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
            <Bookmark size={13} />
            YOUR CAREER COLLECTION
          </div>

          <h1>
            My <span>Saved Jobs</span>
          </h1>

          <p>
            Track roles you are evaluating and apply directly when you are ready.
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
              <Bookmark size={32} />
            </div>

            <span className="saved-empty-label">
              YOUR SHORTLIST IS EMPTY
            </span>

            <h2>No saved jobs yet</h2>

            <p>
              When exploring positions in the job catalog, click the bookmark icon to save roles here for later review.
            </p>

            <Link to="/jobs" className="browse-jobs-btn">
              <span>Explore All Jobs</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        ) : (
          /* JOBS GRID */
          <section className="saved-jobs-grid">
            {savedJobs.map((job) => (
              <article className="saved-job-card" key={job.id}>
                {/* CARD HEADER */}
                <div className="saved-card-header">
                  <div className="saved-company-avatar">
                    {job.company_name?.charAt(0).toUpperCase() || "J"}
                  </div>

                  <div>
                    <h2>{job.title}</h2>
                    <p>{job.company_name}</p>
                  </div>
                </div>

                {/* BADGES */}
                <div className="saved-job-badges">
                  {job.job_type && (
                    <span className="saved-job-type">
                      {job.job_type}
                    </span>
                  )}

                  {job.remote && (
                    <span className="saved-remote">
                      <span className="remote-dot"></span> Remote
                    </span>
                  )}
                </div>

                {/* DETAILS METADATA */}
                <div className="saved-job-details">
                  <div>
                    <small>LOCATION</small>
                    <p>
                      <MapPin size={12} />
                      <span>{job.location || "Not specified"}</span>
                    </p>
                  </div>

                  <div>
                    <small>SALARY</small>
                    <p className="salary-value">
                      <IndianRupee size={12} />
                      <span>
                        {job.salary
                          ? Number(job.salary).toLocaleString("en-IN")
                          : "Competitive"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <small>EXPERIENCE</small>
                    <p>
                      <GraduationCap size={12} />
                      <span>{job.experience_level || "Any"}</span>
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
                    onClick={() => removeSavedJob(job.id)}
                    title="Remove from saved jobs"
                  >
                    <BookmarkCheck size={14} />
                    <span>Saved</span>
                  </button>

                  <Link to={`/jobs/${job.id}`} className="saved-view-btn">
                    <span>View Role</span>
                    <ArrowRight size={13} />
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