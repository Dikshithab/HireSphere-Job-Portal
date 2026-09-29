import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/MyResume.css";

function MyResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // ==========================================
  // FETCH MY RESUMES
  // ==========================================

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get(
          "/resumes/builder/"
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
      setDeletingId(id);

      await api.delete(
        `/resumes/builder/${id}/`
      );

      setResumes((prev) =>
        prev.filter(
          (resume) => resume.id !== id
        )
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
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="my-resumes-page">

        <div className="my-resumes-bg-grid"></div>

        <div className="my-resumes-orb resume-orb-one"></div>
        <div className="my-resumes-orb resume-orb-two"></div>

        <div className="my-resumes-loading">

          <div className="resume-loading-ring">
            <span>✦</span>
          </div>

          <span className="resume-loading-label">
            HIRESHERE
          </span>

          <h2>
            Loading your resumes
          </h2>

          <p>
            Preparing your resume workspace...
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

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="my-resumes-bg-grid"></div>

      <div className="my-resumes-orb resume-orb-one"></div>
      <div className="my-resumes-orb resume-orb-two"></div>
      <div className="my-resumes-orb resume-orb-three"></div>


      <div className="my-resumes-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="my-resumes-header">

          <div className="my-resumes-header-content">

            <div className="resume-eyebrow">

              <span className="resume-eyebrow-dot"></span>

              RESUME WORKSPACE

              <span className="resume-ai-badge">
                AI READY
              </span>

            </div>

            <h1>
              My{" "}
              <span className="resume-gradient-text">
                Resumes.
              </span>
            </h1>

            <p>
              Build, manage and optimize your
              professional resumes in one place.
            </p>

          </div>


          <button
            className="create-resume-btn"
            onClick={() =>
              navigate("/resumes/builder/")
            }
          >
            <span className="create-resume-icon">
              ＋
            </span>

            <span>
              Create Resume
            </span>

            <span className="create-resume-arrow">
              →
            </span>

          </button>

        </header>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div className="resume-error">

            <div className="resume-error-icon">
              !
            </div>

            <div>
              <strong>
                Unable to load resumes
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>

        )}


        {/* =====================================
            RESUME SUMMARY
        ===================================== */}

        {!error && resumes.length > 0 && (

          <section className="resume-summary">

            <div className="resume-summary-main">

              <div className="resume-summary-icon">
                ◫
              </div>

              <div>

                <span>
                  YOUR RESUME LIBRARY
                </span>

                <div className="resume-summary-value">

                  <strong>
                    {resumes.length}
                  </strong>

                  <small>
                    {resumes.length === 1
                      ? "resume"
                      : "resumes"}
                  </small>

                </div>

              </div>

            </div>


            <div className="resume-summary-status">

              <span className="resume-status-dot"></span>

              Ready for applications

            </div>

          </section>

        )}


        {/* =====================================
            EMPTY STATE
        ===================================== */}

        {!error && resumes.length === 0 && (

          <section className="empty-resumes">

            <div className="empty-resume-glow"></div>

            <div className="empty-resume-icon">
              📄
            </div>

            <span className="empty-resume-label">
              BUILD YOUR PROFILE
            </span>

            <h2>
              No resumes yet
            </h2>

            <p>
              Create your first professional,
              ATS-friendly resume and start applying
              to opportunities with confidence.
            </p>

            <button
              className="empty-create-resume-btn"
              onClick={() =>
                navigate("/resumes/builder/")
              }
            >
              <span>＋</span>
              Create My Resume
              <span>→</span>
            </button>

          </section>

        )}


        {/* =====================================
            RESUME LIST
        ===================================== */}

        {!error && resumes.length > 0 && (

          <section className="resume-library">

            <div className="resume-library-header">

              <div>

                <span className="resume-section-kicker">
                  YOUR DOCUMENTS
                </span>

                <h2>
                  Resume Library
                </h2>

              </div>

              <span className="resume-count">
                {resumes.length}{" "}
                {resumes.length === 1
                  ? "resume"
                  : "resumes"}
              </span>

            </div>


            <div className="resume-list">

              {resumes.map(
                (resume, index) => (

                  <article
                    className="resume-card"
                    key={resume.id}
                  >

                    {/* =================================
                        RESUME NUMBER
                    ================================= */}

                    <div className="resume-card-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>


                    {/* =================================
                        RESUME ICON
                    ================================= */}

                    <div className="resume-card-icon">
                      <span>📄</span>
                    </div>


                    {/* =================================
                        RESUME CONTENT
                    ================================= */}

                    <div className="resume-card-content">

                      <div className="resume-card-badge">
                        <span></span>
                        PROFESSIONAL RESUME
                      </div>

                      <h2>
                        {resume.title ||
                          "Untitled Resume"}
                      </h2>

                      <p className="resume-name">
                        {resume.full_name ||
                          "No name provided"}
                      </p>

                      <p className="resume-email">
                        {resume.email ||
                          "No email provided"}
                      </p>

                      <div className="resume-created">

                        <span>
                          ◷
                        </span>

                        Created{" "}

                        {resume.created_at
                          ? new Date(
                              resume.created_at
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}

                      </div>

                    </div>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="resume-card-actions">

                      {/* VIEW */}

                      <button
                        className="resume-view-btn"
                        onClick={() =>
                          navigate(
                            `/resume-preview/${resume.id}`
                          )
                        }
                      >
                        <span>◉</span>
                        View
                      </button>


                      {/* EDIT */}

                      <button
                        className="resume-edit-btn"
                        onClick={() =>
                          navigate(
                            `/resumes/builder/${resume.id}`
                          )
                        }
                      >
                        <span>✎</span>
                        Edit
                      </button>


                      {/* DELETE */}

                      <button
                        className="delete-resume-btn"
                        disabled={
                          deletingId === resume.id
                        }
                        onClick={() =>
                          deleteResume(
                            resume.id
                          )
                        }
                      >

                        {deletingId ===
                        resume.id ? (
                          <>
                            <span className="resume-delete-spinner"></span>
                            Deleting
                          </>
                        ) : (
                          <>
                            <span>×</span>
                            Delete
                          </>
                        )}

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}


        {/* =====================================
            BOTTOM AI CTA
        ===================================== */}

        {!error && resumes.length > 0 && (

          <section className="resume-ai-cta">

            <div className="resume-cta-glow"></div>

            <div className="resume-cta-icon">
              ✦
            </div>

            <div className="resume-cta-content">

              <span>
                AI RESUME OPTIMIZATION
              </span>

              <h3>
                Make your resume application-ready.
              </h3>

              <p>
                Analyze your resume with HireSphere AI
                and improve your ATS compatibility.
              </p>

            </div>

            <button
              className="resume-cta-btn"
              onClick={() =>
                navigate("/resume-analyzer")
              }
            >
              Analyze Resume
              <span>→</span>
            </button>

          </section>

        )}

      </div>

    </div>
  );
}

export default MyResume;