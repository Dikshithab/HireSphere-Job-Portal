import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/MyResume.css";

function MyResume() {

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // FETCH MY RESUMES
  // ==========================================

  useEffect(() => {

    const fetchResumes = async () => {

      try {

        const response = await api.get(
          "/resume-builder"
        );

        console.log(
          "My Resumes:",
          response.data
        );

        setResumes(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(
          "Failed to load resumes:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.response?.data ||
          "Failed to load resumes."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchResumes();

  }, []);


  // ==========================================
  // DELETE RESUME
  // ==========================================

  const deleteResume = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/resume-builder/${id}`
      );

      setResumes(prev =>
        prev.filter(resume => resume.id !== id)
      );

    } catch (err) {

      console.error(
        "Delete Resume Error:",
        err
      );

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to delete resume."
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="my-resumes-page">

        <div className="my-resumes-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading your resumes...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="my-resumes-page">

      <div className="my-resumes-container">

        {/* HEADER */}

        <div className="my-resumes-header">

          <div>

            <span className="resume-eyebrow">
              RESUME MANAGEMENT
            </span>

            <h1>
              My Resumes
            </h1>

            <p>
              View and manage your created resumes.
            </p>

          </div>

          <button
            className="create-resume-btn"
            onClick={() =>
              navigate("/resume-builder")
            }
          >
            + Create Resume
          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div className="resume-error">
            ⚠️ {error}
          </div>

        )}


        {/* EMPTY */}

        {!error && resumes.length === 0 && (

          <div className="empty-resumes">

            <div className="empty-resume-icon">
              📄
            </div>

            <h2>
              No resumes yet
            </h2>

            <p>
              Create your first professional
              ATS-friendly resume.
            </p>

            <button
              className="create-resume-btn"
              onClick={() =>
                navigate("/resume-builder")
              }
            >
              Create My Resume
            </button>

          </div>

        )}


        {/* RESUME LIST */}

        {resumes.length > 0 && (

          <div className="resume-list">

            {resumes.map((resume) => (

              <div
                className="resume-card"
                key={resume.id}
              >

                <div className="resume-card-icon">
                  📄
                </div>

                <div className="resume-card-content">

                  <h2>
                    {resume.title ||
                      "Untitled Resume"}
                  </h2>

                  <p>
                    {resume.fullName ||
                      "No name provided"}
                  </p>

                  <span>
                    {resume.email ||
                      "No email provided"}
                  </span>

                  <small>
                    Created{" "}
                    {resume.createdAt
                      ? new Date(
                          resume.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </small>

                </div>


                <div className="resume-card-actions">

                  {/* VIEW */}

                  <button
                    onClick={() =>
                      navigate(
                        `/resume-preview/${resume.id}`
                      )
                    }
                  >
                    👁 View
                  </button>


                  {/* EDIT */}

                  <button
                    onClick={() =>
                      navigate(
                        `/resume-builder/${resume.id}`
                      )
                    }
                  >
                    ✏️ Edit
                  </button>


                  {/* DELETE */}

                  <button
                    className="delete-resume-btn"
                    onClick={() =>
                      deleteResume(resume.id)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default MyResume;
