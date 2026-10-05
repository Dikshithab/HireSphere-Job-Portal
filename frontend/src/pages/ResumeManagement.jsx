import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/ResumeManagement.css";

function ResumeManagement() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    try {
      const response = await api.get("/resumes/manage/");
      setResumes(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Unable to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const makePrimary = async (id) => {
    try {
      await api.patch(`/resumes/manage/${id}/`);

      setMessage("Primary resume updated successfully.");
      await fetchResumes();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to update primary resume."
      );
    }
  };

  const deleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/resumes/manage/${id}/`);

      setMessage("Resume deleted successfully.");
      await fetchResumes();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to delete resume."
      );
    }
  };

  if (loading) {
    return (
      <div className="resume-management-page">
        <h2>Loading resumes...</h2>
      </div>
    );
  }

  return (
    <div className="resume-management-page">

      <div className="resume-management-header">
        <div>
          <span>HIRESPHERE</span>
          <h1>My Resumes</h1>
          <p>
            Manage your resumes and choose your primary resume.
          </p>
        </div>

        <Link
          to="/resume-analyzer"
          className="upload-resume-btn"
        >
          + Upload Resume
        </Link>
      </div>

      {message && (
        <div className="resume-message success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="resume-message error">
          ! {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="empty-resumes">
          <div>📄</div>
          <h2>No resumes yet</h2>
          <p>
            Upload your first resume to start using
            HireSphere AI features.
          </p>

          <Link
            to="/resume-analyzer"
            className="upload-resume-btn"
          >
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="resume-list">

          {resumes.map((resume) => (
            <div
              className={`resume-card ${
                resume.is_primary ? "primary" : ""
              }`}
              key={resume.id}
            >

              <div className="resume-icon">
                📄
              </div>

              <div className="resume-info">

                <div className="resume-title-row">
                  <h2>{resume.title}</h2>

                  {resume.is_primary && (
                    <span className="primary-badge">
                      PRIMARY
                    </span>
                  )}
                </div>

                <p>
                  {resume.file_name ||
                    "Resume document"}
                </p>

                <small>
                  Source: {resume.source}
                </small>

              </div>

              <div className="resume-actions">

                {!resume.is_primary && (
                  <button
                    onClick={() =>
                      makePrimary(resume.id)
                    }
                  >
                    Make Primary
                  </button>
                )}

                <button
                  className="delete-resume"
                  onClick={() =>
                    deleteResume(resume.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ResumeManagement;