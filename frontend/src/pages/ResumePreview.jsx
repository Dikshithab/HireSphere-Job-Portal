import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/ResumePreview.css";

function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(
    localStorage.getItem(`resume-template-${id}`) || "modern"
  );

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const changeTemplate = (newTemplate) => {
    setTemplate(newTemplate);

    localStorage.setItem(
      `resume-template-${id}`,
      newTemplate
    );
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        console.log("Fetching Resume ID:", id);

        const response = await api.get(
          `/resumes/builder/${id}/`
        );

        console.log(
          "Resume Preview Response:",
          response.data
        );

        setResume(response.data);

        const savedTemplate = localStorage.getItem(
          `resume-template-${id}`
        );

        if (!savedTemplate && response.data?.template) {
          setTemplate(response.data.template);
        }
      } catch (err) {
        console.error(
          "Resume Preview Error:",
          err
        );

        if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (err.response?.status === 404) {
          setError("Resume not found.");
        } else {
          setError(
            err.response?.data?.message ||
              err.response?.data?.detail ||
              "Unable to load resume."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    } else {
      setError("Resume ID is missing.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="resume-preview-page">
        <div className="resume-preview-bg-grid"></div>

        <div className="resume-preview-orb resume-preview-orb-one"></div>
        <div className="resume-preview-orb resume-preview-orb-two"></div>

        <div className="resume-preview-loading-card">
          <div className="resume-loading-spinner"></div>

          <span className="preview-eyebrow">
            HIRESPHERE AI
          </span>

          <h2>Preparing your resume</h2>

          <p>
            Loading your professional resume preview...
          </p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="resume-preview-page">
        <div className="resume-preview-bg-grid"></div>

        <div className="resume-preview-orb resume-preview-orb-one"></div>
        <div className="resume-preview-orb resume-preview-orb-two"></div>

        <div className="resume-preview-error-card">
          <div className="error-icon">!</div>

          <span className="preview-eyebrow">
            RESUME PREVIEW
          </span>

          <h2>Unable to load resume</h2>

          <p>
            {error || "Resume not found."}
          </p>

          <button
            className="error-back-btn"
            onClick={() => navigate("/my-resumes")}
          >
            ← Back to My Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview-page">
      <div className="resume-preview-bg-grid"></div>

      <div className="resume-preview-orb resume-preview-orb-one"></div>
      <div className="resume-preview-orb resume-preview-orb-two"></div>

      {/* =====================================
          TOP TOOLBAR
      ====================================== */}

      <div className="resume-preview-toolbar">
        <div className="toolbar-left">
          <button
            className="toolbar-back"
            onClick={() => navigate("/my-resumes")}
          >
            <span>←</span>
            <span>My Resumes</span>
          </button>

          <div className="toolbar-divider"></div>

          <div className="toolbar-title">
            <span className="preview-eyebrow">
              HIRESPHERE
            </span>

            <h1>Resume Preview</h1>
          </div>
        </div>

        {/* TEMPLATE SELECTOR */}

        <div className="template-selector">
          <span className="template-selector-label">
            <span className="template-label-dot"></span>
            Template
          </span>

          <div className="template-buttons">
            <button
              className={
                template === "modern"
                  ? "template-option selected"
                  : "template-option"
              }
              onClick={() => changeTemplate("modern")}
            >
              Modern
            </button>

            <button
              className={
                template === "classic"
                  ? "template-option selected"
                  : "template-option"
              }
              onClick={() => changeTemplate("classic")}
            >
              Classic
            </button>

            <button
              className={
                template === "professional"
                  ? "template-option selected"
                  : "template-option"
              }
              onClick={() =>
                changeTemplate("professional")
              }
            >
              Professional
            </button>

            <button
              className={
                template === "minimal"
                  ? "template-option selected"
                  : "template-option"
              }
              onClick={() => changeTemplate("minimal")}
            >
              Minimal
            </button>
          </div>
        </div>

        {/* PRINT */}

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          <span className="print-icon">↗</span>
          Print / Save PDF
        </button>
      </div>

      {/* =====================================
          PREVIEW WORKSPACE
      ====================================== */}

      <main className="resume-preview-workspace">
        <div className="preview-info-bar">
          <div className="preview-status">
            <span className="status-dot"></span>
            <span>Live Preview</span>
          </div>

          <div className="preview-info-text">
            Switch templates to instantly change the
            resume style.
          </div>
        </div>

        {/* =====================================
            RESUME PAPER
        ====================================== */}

        <div
          className={`resume-paper resume-template-${template}`}
        >
          {/* =====================================
              HEADER
          ====================================== */}

          <header className="resume-header">
            <div className="resume-header-main">
              <h1>
                {resume.full_name || "Your Name"}
              </h1>

              <div className="resume-contact">
                {resume.email && (
                  <span>{resume.email}</span>
                )}

                {resume.phone && (
                  <span>{resume.phone}</span>
                )}

                {resume.location && (
                  <span>{resume.location}</span>
                )}
              </div>

              <div className="resume-links">
                {resume.linkedin && (
                  <a
                    href={resume.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                )}

                {resume.github && (
                  <a
                    href={resume.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}

                {resume.portfolio && (
                  <a
                    href={resume.portfolio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* =====================================
              SUMMARY
          ====================================== */}

          {resume.summary && (
            <section className="resume-section">
              <h2>Professional Summary</h2>

              <p className="resume-summary">
                {resume.summary}
              </p>
            </section>
          )}

          {/* =====================================
              SKILLS
          ====================================== */}

          {resume.skills &&
            resume.skills.length > 0 && (
              <section className="resume-section">
                <h2>Skills</h2>

                <div className="resume-skills">
                  {resume.skills.map(
                    (skill, index) => {
                      const skillName =
                        typeof skill === "string"
                          ? skill
                          : skill.skillName ||
                            skill.name ||
                            "";

                      return (
                        <span
                          className="resume-skill"
                          key={index}
                        >
                          {skillName}
                        </span>
                      );
                    }
                  )}
                </div>
              </section>
            )}

          {/* =====================================
              EDUCATION
          ====================================== */}

          {resume.education &&
            resume.education.length > 0 && (
              <section className="resume-section">
                <h2>Education</h2>

                {resume.education.map(
                  (education, index) => (
                    <div
                      className="resume-item"
                      key={index}
                    >
                      <div className="resume-item-top">
                        <h3>
                          {education.degree}
                        </h3>

                        {(education.startYear ||
                          education.endYear) && (
                          <span className="resume-date">
                            {education.startYear}

                            {education.endYear &&
                              ` - ${education.endYear}`}
                          </span>
                        )}
                      </div>

                      <p className="resume-item-subtitle">
                        {education.institution}

                        {education.fieldOfStudy &&
                          ` — ${education.fieldOfStudy}`}
                      </p>

                      {education.grade && (
                        <p className="resume-grade">
                          {education.grade}
                        </p>
                      )}

                      {education.description && (
                        <p className="resume-description">
                          {education.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </section>
            )}

          {/* =====================================
              EXPERIENCE
          ====================================== */}

          {resume.experience &&
            resume.experience.length > 0 && (
              <section className="resume-section">
                <h2>Experience</h2>

                {resume.experience.map(
                  (experience, index) => (
                    <div
                      className="resume-item"
                      key={index}
                    >
                      <div className="resume-item-top">
                        <h3>
                          {experience.jobTitle}
                        </h3>

                        {(experience.startDate ||
                          experience.endDate ||
                          experience.currentlyWorking) && (
                          <span className="resume-date">
                            {experience.startDate}

                            {" - "}

                            {experience.currentlyWorking
                              ? "Present"
                              : experience.endDate}
                          </span>
                        )}
                      </div>

                      <p className="resume-item-subtitle">
                        <strong>
                          {experience.company}
                        </strong>

                        {experience.location &&
                          ` | ${experience.location}`}
                      </p>

                      {experience.description && (
                        <p className="resume-description">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </section>
            )}

          {/* =====================================
              PROJECTS
          ====================================== */}

          {resume.projects &&
            resume.projects.length > 0 && (
              <section className="resume-section">
                <h2>Projects</h2>

                {resume.projects.map(
                  (project, index) => (
                    <div
                      className="resume-item"
                      key={index}
                    >
                      <div className="resume-item-top">
                        <h3>
                          {project.projectName}
                        </h3>

                        {project.projectUrl && (
                          <a
                            className="project-link"
                            href={project.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Project ↗
                          </a>
                        )}
                      </div>

                      {project.technologies && (
                        <p className="project-technologies">
                          <strong>
                            Technologies:
                          </strong>{" "}
                          {project.technologies}
                        </p>
                      )}

                      {project.description && (
                        <p className="resume-description">
                          {project.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </section>
            )}

          {/* =====================================
              CERTIFICATIONS
          ====================================== */}

          {resume.certifications &&
            resume.certifications.length > 0 && (
              <section className="resume-section">
                <h2>Certifications</h2>

                {resume.certifications.map(
                  (certification, index) => (
                    <div
                      className="resume-item"
                      key={index}
                    >
                      <div className="resume-item-top">
                        <h3>
                          {certification.name}
                        </h3>

                        {certification.issueDate && (
                          <span className="resume-date">
                            {certification.issueDate}
                          </span>
                        )}
                      </div>

                      <p className="resume-item-subtitle">
                        {certification.issuingOrganization}
                      </p>

                      {certification.credentialId && (
                        <p className="resume-credential">
                          Credential ID:{" "}
                          {certification.credentialId}
                        </p>
                      )}

                      {certification.credentialUrl && (
                        <a
                          className="credential-link"
                          href={
                            certification.credentialUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify Credential ↗
                        </a>
                      )}
                    </div>
                  )
                )}
              </section>
            )}

          {/* =====================================
              FALLBACK RESUME TEXT
          ====================================== */}

          {resume.extracted_text && (
            <section className="resume-section">
              <h2>Resume Content</h2>

              <div className="resume-text">
                {resume.extracted_text
                  .split("\n")
                  .map((line, index) => (
                    <p key={index}>
                      {line}
                    </p>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResumePreview;