import React, { useState } from "react";
import api from "../services/api";
import "../css/ResumeBuilder.css";

function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "My Professional Resume",

    fullName: "",
    email: "",
    phone: "",
    location: "",

    linkedin: "",
    github: "",
    portfolio: "",

    summary: "",

    education: [],
    experience: [],
    projects: [],
    certifications: [],
    skills: [],
  });

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          grade: "",
          description: "",
        },
      ],
    }));
  };

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    }));
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          projectName: "",
          technologies: "",
          projectUrl: "",
          description: "",
        },
      ],
    }));
  };

  const addCertification = () => {
    setForm((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          issuingOrganization: "",
          issueDate: "",
          credentialId: "",
          credentialUrl: "",
        },
      ],
    }));
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          skillName: "",
          category: "",
        },
      ],
    }));
  };

  const updateArrayItem = (
    section,
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const updated = [...prev[section]];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  const removeArrayItem = (section, index) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const saveResume = async () => {
    if (saving) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        title: form.title.trim(),

        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),

        linkedin: form.linkedin.trim(),
        github: form.github.trim(),
        portfolio: form.portfolio.trim(),

        summary: form.summary.trim(),

        education: form.education,
        experience: form.experience,
        projects: form.projects,
        certifications: form.certifications,
        skills: form.skills,

        template: selectedTemplate,
      };

      console.log("Saving resume:", payload);

      const response = await api.post(
        "/resumes/builder/",
        payload
      );

      console.log(
        "Resume Builder Response:",
        response.data
      );

      setMessage(
        response.data?.message ||
          "Resume created successfully!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Resume Builder Error:",
        err.response?.data || err
      );

      let errorMessage =
        "Failed to create resume.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401) {
          errorMessage =
            "Your session has expired. Please login again.";
        } else if (status === 403) {
          errorMessage =
            "You do not have permission to create this resume.";
        } else if (status === 400) {
          if (
            typeof data === "object" &&
            data !== null
          ) {
            errorMessage = Object.entries(data)
              .map(([field, value]) => {
                const message = Array.isArray(value)
                  ? value.join(", ")
                  : String(value);

                return `${field}: ${message}`;
              })
              .join(" | ");
          } else {
            errorMessage =
              data || "Invalid resume data.";
          }
        } else if (status === 404) {
          errorMessage =
            "Resume Builder endpoint was not found.";
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else {
          errorMessage =
            `Server error (${status}).`;
        }
      } else if (err.request) {
        errorMessage =
          "Unable to connect to the Django server.";
      }

      setError(errorMessage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="resume-builder-page">

      {/* BACKGROUND */}
      <div className="resume-builder-grid"></div>

      <div className="builder-orb builder-orb-one"></div>
      <div className="builder-orb builder-orb-two"></div>
      <div className="builder-orb builder-orb-three"></div>

      <div className="resume-builder-container">

        {/* =================================================
            HERO
        ================================================= */}

        <header className="resume-builder-header">

          <div className="builder-header-content">

            <div className="builder-eyebrow-main">
              <span className="builder-live-dot"></span>
              RESUME STUDIO
              <span className="builder-ai-badge">
                AI READY
              </span>
            </div>

            <h1>
              Build a resume that
              <span className="builder-gradient-text">
                {" "}gets noticed.
              </span>
            </h1>

            <p>
              Create a professional, ATS-friendly resume
              with HireSphere. Choose a design, add your
              experience, and build your career profile.
            </p>

          </div>

          <button
            className="builder-save-top"
            onClick={saveResume}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="builder-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <span>✓</span>
                Save Resume
              </>
            )}
          </button>

        </header>

        {/* =================================================
            STATUS
        ================================================= */}

        {message && (
          <div className="builder-message builder-success">
            <div className="builder-message-icon">
              ✓
            </div>

            <div>
              <strong>Resume saved</strong>
              <span>{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="builder-message builder-error">
            <div className="builder-message-icon">
              !
            </div>

            <div>
              <strong>Unable to save resume</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* =================================================
            TEMPLATE SELECTOR
        ================================================= */}

        <section className="builder-template-section">

          <div className="builder-section-heading">

            <div className="builder-section-number">
              01
            </div>

            <div>
              <span className="builder-section-kicker">
                DESIGN SYSTEM
              </span>

              <h2>
                Choose your template
              </h2>

              <p>
                Select a layout that matches your professional style.
              </p>
            </div>

          </div>

          <div className="template-grid">

            {/* MODERN */}

            <button
              type="button"
              className={`template-card ${
                selectedTemplate === "modern"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleTemplateChange("modern")
              }
            >

              <div className="template-selected-glow"></div>

              <div className="template-preview modern-preview">

                <div className="preview-top">
                  <div className="preview-avatar"></div>

                  <div>
                    <div className="preview-line name"></div>
                    <div className="preview-line small"></div>
                  </div>
                </div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

              </div>

              <div className="template-info">

                <div>
                  <h3>Modern</h3>
                  <p>
                    Clean & developer friendly
                  </p>
                </div>

                {selectedTemplate === "modern" && (
                  <span className="template-check">
                    ✓
                  </span>
                )}

              </div>

            </button>

            {/* CLASSIC */}

            <button
              type="button"
              className={`template-card ${
                selectedTemplate === "classic"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleTemplateChange("classic")
              }
            >

              <div className="template-selected-glow"></div>

              <div className="template-preview classic-preview">

                <div className="classic-title"></div>
                <div className="classic-contact"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

              </div>

              <div className="template-info">

                <div>
                  <h3>Classic</h3>
                  <p>
                    Traditional ATS friendly
                  </p>
                </div>

                {selectedTemplate === "classic" && (
                  <span className="template-check">
                    ✓
                  </span>
                )}

              </div>

            </button>

            {/* PROFESSIONAL */}

            <button
              type="button"
              className={`template-card ${
                selectedTemplate === "professional"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleTemplateChange("professional")
              }
            >

              <div className="template-selected-glow"></div>

              <div className="template-preview professional-preview">

                <div className="professional-header">
                  <div className="professional-name"></div>
                  <div className="professional-contact"></div>
                </div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

              </div>

              <div className="template-info">

                <div>
                  <h3>Professional</h3>
                  <p>
                    Corporate & polished
                  </p>
                </div>

                {selectedTemplate === "professional" && (
                  <span className="template-check">
                    ✓
                  </span>
                )}

              </div>

            </button>

            {/* MINIMAL */}

            <button
              type="button"
              className={`template-card ${
                selectedTemplate === "minimal"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleTemplateChange("minimal")
              }
            >

              <div className="template-selected-glow"></div>

              <div className="template-preview minimal-preview">

                <div className="minimal-name"></div>
                <div className="minimal-contact"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

                <div className="preview-heading"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>

              </div>

              <div className="template-info">

                <div>
                  <h3>Minimal</h3>
                  <p>
                    Simple & elegant
                  </p>
                </div>

                {selectedTemplate === "minimal" && (
                  <span className="template-check">
                    ✓
                  </span>
                )}

              </div>

            </button>

          </div>

        </section>

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading">

            <div className="builder-section-number">
              02
            </div>

            <div>
              <span className="builder-section-kicker">
                YOUR IDENTITY
              </span>

              <h2>Personal information</h2>

              <p>
                Add the details recruiters need to reach you.
              </p>
            </div>

          </div>

          <div className="builder-form-card">

            <div className="form-grid">

              <div className="builder-field">
                <label>Resume Title</label>
                <input
                  name="title"
                  placeholder="My Professional Resume"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Full Name</label>
                <input
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Phone</label>
                <input
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Location</label>
                <input
                  name="location"
                  placeholder="City, State, Country"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>LinkedIn</label>
                <input
                  name="linkedin"
                  placeholder="LinkedIn profile URL"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>GitHub</label>
                <input
                  name="github"
                  placeholder="GitHub profile URL"
                  value={form.github}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Portfolio</label>
                <input
                  name="portfolio"
                  placeholder="Portfolio URL"
                  value={form.portfolio}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading">

            <div className="builder-section-number">
              03
            </div>

            <div>
              <span className="builder-section-kicker">
                YOUR STORY
              </span>

              <h2>Professional summary</h2>

              <p>
                Give recruiters a quick overview of who you are.
              </p>
            </div>

          </div>

          <div className="builder-form-card">

            <div className="builder-field">
              <label>Professional Summary</label>

              <textarea
                name="summary"
                placeholder="Example: Computer Science student and aspiring Python Full Stack Developer with experience building web applications using Django, React and SQL..."
                value={form.summary}
                onChange={handleChange}
                rows={7}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading builder-section-heading-row">

            <div className="builder-section-title-group">

              <div className="builder-section-number">
                04
              </div>

              <div>
                <span className="builder-section-kicker">
                  TECH STACK
                </span>

                <h2>Skills</h2>

                <p>
                  Highlight the skills relevant to your target role.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addSkill}
            >
              <span>＋</span>
              Add Skill
            </button>

          </div>

          <div className="dynamic-list">

            {form.skills.length === 0 && (
              <div className="dynamic-empty">
                <span>✦</span>
                <p>
                  Add your programming languages, frameworks,
                  databases and other skills.
                </p>
              </div>
            )}

            {form.skills.map((skill, index) => (

              <div
                className="dynamic-card"
                key={index}
              >

                <div className="dynamic-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="dynamic-fields">

                  <div className="builder-field">
                    <label>Skill</label>

                    <input
                      placeholder="Python"
                      value={skill.skillName}
                      onChange={(e) =>
                        updateArrayItem(
                          "skills",
                          index,
                          "skillName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Category</label>

                    <input
                      placeholder="Programming / Framework / Database"
                      value={skill.category}
                      onChange={(e) =>
                        updateArrayItem(
                          "skills",
                          index,
                          "category",
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeArrayItem(
                      "skills",
                      index
                    )
                  }
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        </section>

        {/* =================================================
            EDUCATION
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading builder-section-heading-row">

            <div className="builder-section-title-group">

              <div className="builder-section-number">
                05
              </div>

              <div>
                <span className="builder-section-kicker">
                  ACADEMIC JOURNEY
                </span>

                <h2>Education</h2>

                <p>
                  Add your degrees, institutions and academic achievements.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addEducation}
            >
              <span>＋</span>
              Add Education
            </button>

          </div>

          <div className="dynamic-list">

            {form.education.map(
              (education, index) => (

                <div
                  className="dynamic-card large-card"
                  key={index}
                >

                  <div className="dynamic-card-top">

                    <div className="dynamic-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="dynamic-card-label">
                      EDUCATION ENTRY
                    </span>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeArrayItem(
                          "education",
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="dynamic-fields">

                    <div className="builder-field">
                      <label>Degree</label>

                      <input
                        placeholder="B.Tech / B.Sc / M.Tech..."
                        value={education.degree}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Institution</label>

                      <input
                        placeholder="University / College"
                        value={education.institution}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Field of Study</label>

                      <input
                        placeholder="Computer Science"
                        value={education.fieldOfStudy}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "fieldOfStudy",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Start Year</label>

                      <input
                        placeholder="2023"
                        value={education.startYear}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>End Year</label>

                      <input
                        placeholder="2027"
                        value={education.endYear}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Grade / CGPA</label>

                      <input
                        placeholder="8.16 / 10"
                        value={education.grade}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "grade",
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                  <div className="builder-field">

                    <label>Description</label>

                    <textarea
                      placeholder="Relevant coursework, achievements or academic details..."
                      value={education.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "education",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            EXPERIENCE
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading builder-section-heading-row">

            <div className="builder-section-title-group">

              <div className="builder-section-number">
                06
              </div>

              <div>
                <span className="builder-section-kicker">
                  CAREER EXPERIENCE
                </span>

                <h2>Experience</h2>

                <p>
                  Showcase internships, jobs and professional experience.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addExperience}
            >
              <span>＋</span>
              Add Experience
            </button>

          </div>

          <div className="dynamic-list">

            {form.experience.map(
              (experience, index) => (

                <div
                  className="dynamic-card large-card"
                  key={index}
                >

                  <div className="dynamic-card-top">

                    <div className="dynamic-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="dynamic-card-label">
                      EXPERIENCE ENTRY
                    </span>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeArrayItem(
                          "experience",
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="dynamic-fields">

                    <div className="builder-field">
                      <label>Job Title</label>

                      <input
                        placeholder="Software Developer Intern"
                        value={experience.jobTitle}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "jobTitle",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Company</label>

                      <input
                        placeholder="Company Name"
                        value={experience.company}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Location</label>

                      <input
                        placeholder="Hyderabad"
                        value={experience.location}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Start Date</label>

                      <input
                        placeholder="Jun 2025"
                        value={experience.startDate}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>End Date</label>

                      <input
                        placeholder="Sep 2025"
                        value={experience.endDate}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        disabled={
                          experience.currentlyWorking
                        }
                      />
                    </div>

                  </div>

                  <label className="checkbox-row">

                    <input
                      type="checkbox"
                      checked={
                        experience.currentlyWorking
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "currentlyWorking",
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Currently working here
                    </span>

                  </label>

                  <div className="builder-field">

                    <label>
                      Responsibilities & Achievements
                    </label>

                    <textarea
                      placeholder="Describe your responsibilities, achievements and measurable impact..."
                      value={experience.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            PROJECTS
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading builder-section-heading-row">

            <div className="builder-section-title-group">

              <div className="builder-section-number">
                07
              </div>

              <div>
                <span className="builder-section-kicker">
                  BUILD SOMETHING
                </span>

                <h2>Projects</h2>

                <p>
                  Show recruiters what you've actually built.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addProject}
            >
              <span>＋</span>
              Add Project
            </button>

          </div>

          <div className="dynamic-list">

            {form.projects.map(
              (project, index) => (

                <div
                  className="dynamic-card large-card"
                  key={index}
                >

                  <div className="dynamic-card-top">

                    <div className="dynamic-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="dynamic-card-label">
                      PROJECT ENTRY
                    </span>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeArrayItem(
                          "projects",
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="dynamic-fields">

                    <div className="builder-field">
                      <label>Project Name</label>

                      <input
                        placeholder="HireSphere Job Portal"
                        value={project.projectName}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "projectName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Technologies</label>

                      <input
                        placeholder="Python, Django, React, MySQL"
                        value={project.technologies}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "technologies",
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                  <div className="builder-field">

                    <label>Project URL</label>

                    <input
                      placeholder="GitHub / Live Demo URL"
                      value={project.projectUrl}
                      onChange={(e) =>
                        updateArrayItem(
                          "projects",
                          index,
                          "projectUrl",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="builder-field">

                    <label>Project Description</label>

                    <textarea
                      placeholder="Describe the project, your contribution, technologies used and key results..."
                      value={project.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "projects",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            CERTIFICATIONS
        ================================================= */}

        <section className="builder-section">

          <div className="builder-section-heading builder-section-heading-row">

            <div className="builder-section-title-group">

              <div className="builder-section-number">
                08
              </div>

              <div>
                <span className="builder-section-kicker">
                  CREDENTIALS
                </span>

                <h2>Certifications</h2>

                <p>
                  Add certifications that strengthen your profile.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addCertification}
            >
              <span>＋</span>
              Add Certification
            </button>

          </div>

          <div className="dynamic-list">

            {form.certifications.map(
              (certification, index) => (

                <div
                  className="dynamic-card large-card"
                  key={index}
                >

                  <div className="dynamic-card-top">

                    <div className="dynamic-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="dynamic-card-label">
                      CERTIFICATION
                    </span>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeArrayItem(
                          "certifications",
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="dynamic-fields">

                    <div className="builder-field">
                      <label>Certification Name</label>

                      <input
                        placeholder="Python Certification"
                        value={certification.name}
                        onChange={(e) =>
                          updateArrayItem(
                            "certifications",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Issuing Organization</label>

                      <input
                        placeholder="Organization Name"
                        value={
                          certification.issuingOrganization
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "certifications",
                            index,
                            "issuingOrganization",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Issue Date</label>

                      <input
                        placeholder="2026"
                        value={
                          certification.issueDate
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "certifications",
                            index,
                            "issueDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Credential ID</label>

                      <input
                        placeholder="Credential ID"
                        value={
                          certification.credentialId
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "certifications",
                            index,
                            "credentialId",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="builder-field">
                      <label>Credential URL</label>

                      <input
                        placeholder="Verification URL"
                        value={
                          certification.credentialUrl
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "certifications",
                            index,
                            "credentialUrl",
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            FINAL SAVE
        ================================================= */}

        <section className="builder-final-section">

          <div className="builder-final-glow"></div>

          <div className="builder-final-icon">
            ✦
          </div>

          <div className="builder-final-content">

            <span>
              READY TO LAUNCH
            </span>

            <h2>
              Your career story starts here.
            </h2>

            <p>
              Save your resume and continue to preview,
              edit and optimize it with HireSphere AI.
            </p>

          </div>

          <button
            className="builder-final-save"
            onClick={saveResume}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="builder-spinner"></span>
                Saving Resume...
              </>
            ) : (
              <>
                ✓ Create My Resume
                <span>→</span>
              </>
            )}
          </button>

        </section>

      </div>
    </div>
  );
}

export default ResumeBuilder;