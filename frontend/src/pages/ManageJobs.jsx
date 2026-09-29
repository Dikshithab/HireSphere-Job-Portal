import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/ManageJobs.css";

function ManageJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH EMPLOYER JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/jobs/employer/");

      console.log("Employer Jobs:", response.data);

      const formattedJobs = response.data.map((job) => ({
        ...job,
        companyName: job.company_name,
        jobType: job.job_type,
        experienceLevel: job.experience_level,
      }));

      setJobs(formattedJobs);

    } catch (error) {
      console.error(
        "Error loading employer jobs:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load your jobs."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD JOBS
  // ==========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      await api.delete(`/jobs/${id}/manage/`);

      setMessage("Job deleted successfully!");

      await fetchJobs();

    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to delete job."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="manage-jobs-page">

        <div className="manage-loading">

          <div className="loading-icon">
            💼
          </div>

          <h2>
            Loading your jobs...
          </h2>

          <p>
            Please wait while we fetch your
            job postings.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="manage-jobs-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="manage-jobs-header">

        <div>

          <p className="manage-jobs-label">
            EMPLOYER
          </p>

          <h1>
            Manage Jobs
          </h1>

          <p className="manage-jobs-subtitle">
            View, edit and manage your job
            postings.
          </p>

        </div>

        <button
          className="create-job-btn"
          onClick={() =>
            navigate("/create-job")
          }
        >
          <span>
            ＋
          </span>

          Create Job

        </button>

      </div>


      {/* =====================================
          MESSAGE
      ===================================== */}

      {message && (
        <div className="manage-job-message">

          <span>
            ✓
          </span>

          {message}

        </div>
      )}


      {/* =====================================
          JOB SUMMARY
      ===================================== */}

      {jobs.length > 0 && (

        <div className="jobs-summary">

          <div>

            <span className="summary-number">
              {jobs.length}
            </span>

            <span className="summary-label">

              {jobs.length === 1
                ? "job posting"
                : "job postings"}

            </span>

          </div>

        </div>

      )}


      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {jobs.length === 0 ? (

        <div className="no-jobs">

          <div className="empty-job-icon">
            💼
          </div>

          <h2>
            No Jobs Posted Yet
          </h2>

          <p>
            You haven't created any job
            postings. Create your first job
            and start receiving applications
            from candidates.
          </p>

          <button
            className="empty-create-btn"
            onClick={() =>
              navigate("/create-job")
            }
          >
            ＋ Create Your First Job
          </button>

        </div>

      ) : (

        /* ===================================
           JOB LIST
        =================================== */

        <div className="manage-jobs-list">

          {jobs.map((job) => (

            <div
              className="manage-job-card"
              key={job.id}
            >

              {/* =================================
                  CARD HEADER
              ================================= */}

              <div className="job-card-top">

                <div className="job-title-section">

                  <div className="job-icon">
                    💼
                  </div>

                  <div>

                    <h2>
                      {job.title}
                    </h2>

                    <p className="company-name">
                      🏢 {job.companyName}
                    </p>

                  </div>

                </div>


                <span className="manage-job-type">
                  {job.jobType}
                </span>

              </div>


              {/* =================================
                  JOB INFORMATION
              ================================= */}

              <div className="manage-job-info">

                {/* Location */}

                <div className="job-info-item">

                  <span className="info-icon">
                    📍
                  </span>

                  <div>

                    <small>
                      Location
                    </small>

                    <p>
                      {job.location || "N/A"}
                    </p>

                  </div>

                </div>


                {/* Salary */}

                <div className="job-info-item">

                  <span className="info-icon">
                    💰
                  </span>

                  <div>

                    <small>
                      Salary
                    </small>

                    <p>
                      ₹
                      {job.salary
                        ? Number(
                            job.salary
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "N/A"}
                    </p>

                  </div>

                </div>


                {/* Experience */}

                <div className="job-info-item">

                  <span className="info-icon">
                    🎓
                  </span>

                  <div>

                    <small>
                      Experience
                    </small>

                    <p>
                      {job.experienceLevel ||
                        "N/A"}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================
                  ACTIONS
              ================================= */}

              <div className="manage-job-footer">

                <button
                  className="edit-job-btn"
                  onClick={() =>
                    navigate(
                      `/employer/jobs/edit/${job.id}`
                    )
                  }
                >
                  ✏️ Edit Job
                </button>


                <button
                  className="delete-job-btn"
                  disabled={
                    deletingId === job.id
                  }
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >

                  {deletingId === job.id
                    ? "Deleting..."
                    : "🗑️ Delete"}

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ManageJobs;
