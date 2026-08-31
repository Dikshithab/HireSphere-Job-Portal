
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/ResumePreview.css";

function ResumePreview() {

  // Get resume ID BEFORE using it
  const { id } = useParams();

  const navigate = useNavigate();

  const [template, setTemplate] = useState(
    localStorage.getItem(`resume-template-${id}`) || "modern"
  );

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CHANGE TEMPLATE
  // ==========================================

  const changeTemplate = (newTemplate) => {

    setTemplate(newTemplate);

    localStorage.setItem(
      `resume-template-${id}`,
      newTemplate
    );
  };


  // ==========================================
  // FETCH RESUME
  // ==========================================

  useEffect(() => {

    const fetchResume = async () => {

      try {

        const response = await api.get(
          `/resume-builder/${id}`
        );

        console.log(
          "Resume Preview:",
          response.data
        );

        setResume(response.data);

        // If backend already contains a template,
        // use it as the default.
        if (response.data?.template) {

          const savedTemplate =
            localStorage.getItem(
              `resume-template-${id}`
            );

          if (!savedTemplate) {
            setTemplate(response.data.template);
          }
        }

      } catch (err) {

        console.error(
          "Resume Preview Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.response?.data ||
          "Unable to load resume."
        );

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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="resume-preview-page">

        <div className="resume-preview-loading">
          Loading resume...
        </div>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error || !resume) {

    return (
      <div className="resume-preview-page">

        <div className="resume-preview-error">

          <h2>
            Unable to load resume
          </h2>

          <p>
            {error || "Resume not found."}
          </p>

          <button
            onClick={() => navigate("/my-resumes")}
          >
            ← Back to My Resumes
          </button>

        </div>

      </div>
    );

  }


  // ==========================================
  // PREVIEW
  // ==========================================

  return (

    <div className="resume-preview-page">

      {/* =====================================
          TOOLBAR
      ====================================== */}

      <div className="resume-preview-toolbar">

        <button
          className="toolbar-back"
          onClick={() => navigate("/my-resumes")}
        >
          ← My Resumes
        </button>


        {/* TEMPLATE SELECTOR */}

        <div className="template-selector">

          <span>Template</span>

          <button
            className={
              template === "modern"
                ? "selected"
                : ""
            }
            onClick={() =>
              changeTemplate("modern")
            }
          >
            Modern
          </button>


          <button
            className={
              template === "classic"
                ? "selected"
                : ""
            }
            onClick={() =>
              changeTemplate("classic")
            }
          >
            Classic
          </button>


          <button
            className={
              template === "professional"
                ? "selected"
                : ""
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
                ? "selected"
                : ""
            }
            onClick={() =>
              changeTemplate("minimal")
            }
          >
            Minimal
          </button>

        </div>


        {/* PRINT */}

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          🖨 Print / Save PDF
        </button>

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

          <h1>
            {resume.fullName || "Your Name"}
          </h1>


          <p>

            {resume.email}

            {resume.phone &&
              ` | ${resume.phone}`}

            {resume.location &&
              ` | ${resume.location}`}

          </p>


          <p className="resume-links">

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

          </p>

        </header>


        {/* =====================================
            SUMMARY
        ====================================== */}

        {resume.summary && (

          <section className="resume-section">

            <h2>
              PROFESSIONAL SUMMARY
            </h2>

            <p>
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

              <h2>
                SKILLS
              </h2>

              <div className="resume-skills">

                {resume.skills.map(
                  (skill, index) => (

                    <span
                      className="resume-skill"
                      key={index}
                    >
                      {skill.skillName}
                    </span>

                  )
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

              <h2>
                EDUCATION
              </h2>

              {resume.education.map(
                (education, index) => (

                  <div
                    className="resume-item"
                    key={index}
                  >

                    <h3>
                      {education.degree}
                    </h3>

                    <p>
                      {education.institution}

                      {education.fieldOfStudy &&
                        ` — ${education.fieldOfStudy}`}
                    </p>

                    <p>

                      {education.startYear}

                      {education.endYear &&
                        ` - ${education.endYear}`}

                      {education.grade &&
                        ` | ${education.grade}`}

                    </p>

                    {education.description && (

                      <p>
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

              <h2>
                EXPERIENCE
              </h2>

              {resume.experience.map(
                (experience, index) => (

                  <div
                    className="resume-item"
                    key={index}
                  >

                    <h3>
                      {experience.jobTitle}
                    </h3>

                    <p>

                      <strong>
                        {experience.company}
                      </strong>

                      {experience.location &&
                        ` | ${experience.location}`}

                    </p>

                    <p>

                      {experience.startDate}

                      {" - "}

                      {experience.currentlyWorking
                        ? "Present"
                        : experience.endDate}

                    </p>

                    {experience.description && (

                      <p>
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

              <h2>
                PROJECTS
              </h2>

              {resume.projects.map(
                (project, index) => (

                  <div
                    className="resume-item"
                    key={index}
                  >

                    <h3>
                      {project.projectName}
                    </h3>

                    {project.technologies && (

                      <p>
                        <strong>
                          Technologies:
                        </strong>{" "}
                        {project.technologies}
                      </p>

                    )}

                    {project.description && (

                      <p>
                        {project.description}
                      </p>

                    )}

                    {project.projectUrl && (

                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Project Link
                      </a>

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

              <h2>
                CERTIFICATIONS
              </h2>

              {resume.certifications.map(
                (certification, index) => (

                  <div
                    className="resume-item"
                    key={index}
                  >

                    <h3>
                      {certification.name}
                    </h3>

                    <p>

                      {certification.issuingOrganization}

                      {certification.issueDate &&
                        ` | ${certification.issueDate}`}

                    </p>

                    {certification.credentialId && (

                      <p>
                        Credential ID:{" "}
                        {certification.credentialId}
                      </p>

                    )}

                  </div>

                )
              )}

            </section>

          )}


        {/* =====================================
            FALLBACK RESUME TEXT
        ====================================== */}

        {resume.extractedText && (

          <section className="resume-section">

            <h2>
              RESUME CONTENT
            </h2>

            <div className="resume-text">

              {resume.extractedText
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

    </div>

  );

}

export default ResumePreview;
