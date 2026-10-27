import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award
} from "lucide-react";
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

  const updateArrayItem = (section, index, field, value) => {
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
      [section]: prev[section].filter((_, i) => i !== index),
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
      const response = await api.post("/resumes/builder/", payload);
      console.log("Resume Builder Response:", response.data);

      setMessage(
        response.data?.message || "Resume created successfully!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Resume Builder Error:", err.response?.data || err);

      let errorMessage = "Failed to create resume.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401) {
          errorMessage = "Your session has expired. Please login again.";
        } else if (status === 403) {
          errorMessage = "You do not have permission to create this resume.";
        } else if (status === 400) {
          if (typeof data === "object" && data !== null) {
            errorMessage = Object.entries(data)
              .map(([field, value]) => {
                const message = Array.isArray(value)
                  ? value.join(", ")
                  : String(value);
                return `${field}: ${message}`;
              })
              .join(" | ");
          } else {
            errorMessage = data || "Invalid resume data.";
          }
        } else if (status === 404) {
          errorMessage = "Resume Builder endpoint was not found.";
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `Server error (${status}).`;
        }
      } else if (err.request) {
        errorMessage = "Unable to connect to the Django server.";
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
      {/* Background Atmosphere */}
      <div className="resume-builder-grid"></div>
      <div className="builder-orb builder-orb-one"></div>
      <div className="builder-orb builder-orb-two"></div>
      <div className="builder-orb builder-orb-three"></div>

      <div className="resume-builder-container">
        {/* HERO SECTION */}
        <header className="resume-builder-header">
          <div className="builder-header-content">
            <div className="builder-eyebrow-main">
              <span className="builder-live-dot"></span>
              RESUME STUDIO
              <span className="builder-ai-badge">AI OPTIMIZED</span>
            </div>

            <h1>
              Build an ATS-ready resume that <span className="builder-gradient-text">stands out.</span>
            </h1>

            <p>
              Design an interview-winning resume in minutes. Choose an ATS-optimized template, populate your experience,
              and sync seamlessly with HireSphere's AI scoring engine.
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Save Resume</span>
              </>
            )}
          </button>
        </header>

        {/* STATUS MESSAGES */}
        {message && (
          <div className="builder-message builder-success">
            <div className="builder-message-icon">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <strong>Resume Saved</strong>
              <span>{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="builder-message builder-error">
            <div className="builder-message-icon">
              <AlertTriangle size={18} />
            </div>
            <div>
              <strong>Unable to save resume</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* SECTION 01: TEMPLATE SELECTOR */}
        <section className="builder-template-section">
          <div className="builder-section-heading">
            <div className="builder-section-number">01</div>
            <div>
              <span className="builder-section-kicker">DESIGN SYSTEM</span>
              <h2>Choose Layout Template</h2>
              <p>Select a clean layout tailored for modern tech and executive recruiters.</p>
            </div>
          </div>

          <div className="template-grid">
            {/* MODERN */}
            <button
              type="button"
              className={`template-card ${selectedTemplate === "modern" ? "selected" : ""}`}
              onClick={() => handleTemplateChange("modern")}
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
                  <p>Developer & Startup Friendly</p>
                </div>
                {selectedTemplate === "modern" && (
                  <span className="template-check">
                    <Check size={14} />
                  </span>
                )}
              </div>
            </button>

            {/* CLASSIC */}
            <button
              type="button"
              className={`template-card ${selectedTemplate === "classic" ? "selected" : ""}`}
              onClick={() => handleTemplateChange("classic")}
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
                  <p>Traditional ATS Compliant</p>
                </div>
                {selectedTemplate === "classic" && (
                  <span className="template-check">
                    <Check size={14} />
                  </span>
                )}
              </div>
            </button>

            {/* PROFESSIONAL */}
            <button
              type="button"
              className={`template-card ${selectedTemplate === "professional" ? "selected" : ""}`}
              onClick={() => handleTemplateChange("professional")}
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
                  <p>Corporate & Senior Level</p>
                </div>
                {selectedTemplate === "professional" && (
                  <span className="template-check">
                    <Check size={14} />
                  </span>
                )}
              </div>
            </button>

            {/* MINIMAL */}
            <button
              type="button"
              className={`template-card ${selectedTemplate === "minimal" ? "selected" : ""}`}
              onClick={() => handleTemplateChange("minimal")}
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
                  <p>Concise Single Column</p>
                </div>
                {selectedTemplate === "minimal" && (
                  <span className="template-check">
                    <Check size={14} />
                  </span>
                )}
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 02: PERSONAL INFORMATION */}
        <section className="builder-section">
          <div className="builder-section-heading">
            <div className="builder-section-number">02</div>
            <div>
              <span className="builder-section-kicker">CONTACT & IDENTITY</span>
              <h2>Personal Information</h2>
              <p>Key contact channels recruiters use to get in touch with you.</p>
            </div>
          </div>

          <div className="builder-form-card">
            <div className="form-grid">
              <div className="builder-field">
                <label>Resume Internal Title</label>
                <input
                  name="title"
                  placeholder="e.g. My Full Stack Developer Resume"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Full Name</label>
                <input
                  name="fullName"
                  placeholder="e.g. Shiva Rama"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="e.g. shiva@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Location</label>
                <input
                  name="location"
                  placeholder="e.g. Hyderabad, India"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>LinkedIn Profile</label>
                <input
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourname"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>GitHub Profile</label>
                <input
                  name="github"
                  placeholder="https://github.com/yourname"
                  value={form.github}
                  onChange={handleChange}
                />
              </div>

              <div className="builder-field">
                <label>Portfolio / Personal Website</label>
                <input
                  name="portfolio"
                  placeholder="https://yourportfolio.dev"
                  value={form.portfolio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03: PROFESSIONAL SUMMARY */}
        <section className="builder-section">
          <div className="builder-section-heading">
            <div className="builder-section-number">03</div>
            <div>
              <span className="builder-section-kicker">EXECUTIVE STATEMENT</span>
              <h2>Professional Summary</h2>
              <p>Highlight your core strengths, years of experience, and primary accomplishments.</p>
            </div>
          </div>

          <div className="builder-form-card">
            <div className="builder-field">
              <label>Executive Summary</label>
              <textarea
                name="summary"
                placeholder="Example: Motivated Software Engineer with hands-on experience developing production-grade web applications using Python, Django, React, and PostgreSQL. Passionate about performant system design and AI integrations..."
                value={form.summary}
                onChange={handleChange}
                rows={6}
              />
            </div>
          </div>
        </section>

        {/* SECTION 04: SKILLS */}
        <section className="builder-section">
          <div className="builder-section-heading builder-section-heading-row">
            <div className="builder-section-title-group">
              <div className="builder-section-number">04</div>
              <div>
                <span className="builder-section-kicker">TECHNICAL PROFICIENCIES</span>
                <h2>Skills & Competencies</h2>
                <p>Categorize your technical skills, programming languages, and tools.</p>
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={addSkill}>
              <Plus size={14} />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="dynamic-list">
            {form.skills.length === 0 && (
              <div className="dynamic-empty">
                <Sparkles size={16} />
                <p>No skills added yet. Click "+ Add Skill" to start detailing your technical toolbelt.</p>
              </div>
            )}

            {form.skills.map((skill, index) => (
              <div className="dynamic-card" key={index}>
                <div className="dynamic-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="dynamic-fields">
                  <div className="builder-field">
                    <label>Skill Name</label>
                    <input
                      placeholder="e.g. Python, React, PostgreSQL"
                      value={skill.skillName}
                      onChange={(e) =>
                        updateArrayItem("skills", index, "skillName", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Category</label>
                    <input
                      placeholder="e.g. Languages / Frameworks / Cloud"
                      value={skill.category}
                      onChange={(e) =>
                        updateArrayItem("skills", index, "category", e.target.value)
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayItem("skills", index)}
                  title="Remove skill"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 05: EDUCATION */}
        <section className="builder-section">
          <div className="builder-section-heading builder-section-heading-row">
            <div className="builder-section-title-group">
              <div className="builder-section-number">05</div>
              <div>
                <span className="builder-section-kicker">ACADEMIC BACKGROUND</span>
                <h2>Education</h2>
                <p>Add degrees, academic institutions, and notable distinctions.</p>
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={addEducation}>
              <Plus size={14} />
              <span>Add Education</span>
            </button>
          </div>

          <div className="dynamic-list">
            {form.education.length === 0 && (
              <div className="dynamic-empty">
                <GraduationCap size={16} />
                <p>No education records added yet. Click "+ Add Education" to add your academic credentials.</p>
              </div>
            )}

            {form.education.map((edu, index) => (
              <div className="dynamic-card large-card" key={index}>
                <div className="dynamic-card-top">
                  <div className="dynamic-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="dynamic-card-label">EDUCATION RECORD #{index + 1}</span>

                  <button
                    type="button"
                    className="remove-btn-text"
                    onClick={() => removeArrayItem("education", index)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="dynamic-fields">
                  <div className="builder-field">
                    <label>Degree / Qualification</label>
                    <input
                      placeholder="e.g. B.Tech in Computer Science"
                      value={edu.degree}
                      onChange={(e) =>
                        updateArrayItem("education", index, "degree", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Institution / University</label>
                    <input
                      placeholder="e.g. JNTU Hyderabad"
                      value={edu.institution}
                      onChange={(e) =>
                        updateArrayItem("education", index, "institution", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Field of Study</label>
                    <input
                      placeholder="e.g. Software Engineering"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        updateArrayItem("education", index, "fieldOfStudy", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Start Year</label>
                    <input
                      placeholder="e.g. 2022"
                      value={edu.startYear}
                      onChange={(e) =>
                        updateArrayItem("education", index, "startYear", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>End Year (or Expected)</label>
                    <input
                      placeholder="e.g. 2026"
                      value={edu.endYear}
                      onChange={(e) =>
                        updateArrayItem("education", index, "endYear", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Grade / CGPA</label>
                    <input
                      placeholder="e.g. 8.5 / 10 CGPA"
                      value={edu.grade}
                      onChange={(e) =>
                        updateArrayItem("education", index, "grade", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="builder-field">
                  <label>Activities & Relevant Coursework</label>
                  <textarea
                    placeholder="e.g. Data Structures, Distributed Systems, Web Technologies, ACM Student Chapter Lead..."
                    value={edu.description}
                    onChange={(e) =>
                      updateArrayItem("education", index, "description", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 06: WORK EXPERIENCE */}
        <section className="builder-section">
          <div className="builder-section-heading builder-section-heading-row">
            <div className="builder-section-title-group">
              <div className="builder-section-number">06</div>
              <div>
                <span className="builder-section-kicker">PROFESSIONAL TRACK</span>
                <h2>Work Experience</h2>
                <p>Highlight roles, internships, achievements, and impact metrics.</p>
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={addExperience}>
              <Plus size={14} />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="dynamic-list">
            {form.experience.length === 0 && (
              <div className="dynamic-empty">
                <Briefcase size={16} />
                <p>No work experience added yet. Click "+ Add Experience" to showcase your career timeline.</p>
              </div>
            )}

            {form.experience.map((exp, index) => (
              <div className="dynamic-card large-card" key={index}>
                <div className="dynamic-card-top">
                  <div className="dynamic-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="dynamic-card-label">POSITION #{index + 1}</span>

                  <button
                    type="button"
                    className="remove-btn-text"
                    onClick={() => removeArrayItem("experience", index)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="dynamic-fields">
                  <div className="builder-field">
                    <label>Job Title</label>
                    <input
                      placeholder="e.g. Full Stack Developer Intern"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        updateArrayItem("experience", index, "jobTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Company / Organization</label>
                    <input
                      placeholder="e.g. TechCorp Solutions"
                      value={exp.company}
                      onChange={(e) =>
                        updateArrayItem("experience", index, "company", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Location</label>
                    <input
                      placeholder="e.g. Bangalore, India (or Remote)"
                      value={exp.location}
                      onChange={(e) =>
                        updateArrayItem("experience", index, "location", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Start Date</label>
                    <input
                      placeholder="e.g. Jan 2025"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateArrayItem("experience", index, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>End Date</label>
                    <input
                      placeholder="e.g. Present"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateArrayItem("experience", index, "endDate", e.target.value)
                      }
                      disabled={exp.currentlyWorking}
                    />
                  </div>
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      updateArrayItem("experience", index, "currentlyWorking", e.target.checked)
                    }
                  />
                  <span>I currently work in this role</span>
                </label>

                <div className="builder-field">
                  <label>Key Responsibilities & Measurable Impact</label>
                  <textarea
                    placeholder="e.g. Designed and implemented RESTful APIs using Django REST Framework, decreasing response latency by 35%..."
                    value={exp.description}
                    onChange={(e) =>
                      updateArrayItem("experience", index, "description", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 07: PROJECTS */}
        <section className="builder-section">
          <div className="builder-section-heading builder-section-heading-row">
            <div className="builder-section-title-group">
              <div className="builder-section-number">07</div>
              <div>
                <span className="builder-section-kicker">PRACTICAL PORTFOLIO</span>
                <h2>Projects & Repositories</h2>
                <p>Demonstrate your engineering capabilities through software projects you've built.</p>
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={addProject}>
              <Plus size={14} />
              <span>Add Project</span>
            </button>
          </div>

          <div className="dynamic-list">
            {form.projects.length === 0 && (
              <div className="dynamic-empty">
                <Code size={16} />
                <p>No projects listed yet. Click "+ Add Project" to highlight your best applications and tools.</p>
              </div>
            )}

            {form.projects.map((proj, index) => (
              <div className="dynamic-card large-card" key={index}>
                <div className="dynamic-card-top">
                  <div className="dynamic-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="dynamic-card-label">PROJECT #{index + 1}</span>

                  <button
                    type="button"
                    className="remove-btn-text"
                    onClick={() => removeArrayItem("projects", index)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="dynamic-fields">
                  <div className="builder-field">
                    <label>Project Title</label>
                    <input
                      placeholder="e.g. HireSphere Job Portal"
                      value={proj.projectName}
                      onChange={(e) =>
                        updateArrayItem("projects", index, "projectName", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Technologies Used</label>
                    <input
                      placeholder="e.g. React, Django, PostgreSQL, Groq AI"
                      value={proj.technologies}
                      onChange={(e) =>
                        updateArrayItem("projects", index, "technologies", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="builder-field">
                  <label>Live URL / GitHub Repository</label>
                  <input
                    placeholder="e.g. https://github.com/user/project"
                    value={proj.projectUrl}
                    onChange={(e) =>
                      updateArrayItem("projects", index, "projectUrl", e.target.value)
                    }
                  />
                </div>

                <div className="builder-field">
                  <label>Project Overview & Achievements</label>
                  <textarea
                    placeholder="e.g. Architected an AI-powered recruitment engine featuring real-time ATS scoring, resume parsing, and semantic job matching..."
                    value={proj.description}
                    onChange={(e) =>
                      updateArrayItem("projects", index, "description", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 08: CERTIFICATIONS */}
        <section className="builder-section">
          <div className="builder-section-heading builder-section-heading-row">
            <div className="builder-section-title-group">
              <div className="builder-section-number">08</div>
              <div>
                <span className="builder-section-kicker">CREDENTIALS & HONORS</span>
                <h2>Certifications</h2>
                <p>Add recognized industry certifications and verifiable badges.</p>
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={addCertification}>
              <Plus size={14} />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="dynamic-list">
            {form.certifications.length === 0 && (
              <div className="dynamic-empty">
                <Award size={16} />
                <p>No certifications added yet. Click "+ Add Certification" to include your verified credentials.</p>
              </div>
            )}

            {form.certifications.map((cert, index) => (
              <div className="dynamic-card large-card" key={index}>
                <div className="dynamic-card-top">
                  <div className="dynamic-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="dynamic-card-label">CERTIFICATE #{index + 1}</span>

                  <button
                    type="button"
                    className="remove-btn-text"
                    onClick={() => removeArrayItem("certifications", index)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="dynamic-fields">
                  <div className="builder-field">
                    <label>Certification Name</label>
                    <input
                      placeholder="e.g. AWS Certified Developer"
                      value={cert.name}
                      onChange={(e) =>
                        updateArrayItem("certifications", index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Issuing Organization</label>
                    <input
                      placeholder="e.g. Amazon Web Services"
                      value={cert.issuingOrganization}
                      onChange={(e) =>
                        updateArrayItem("certifications", index, "issuingOrganization", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Issue Date / Validity</label>
                    <input
                      placeholder="e.g. Nov 2025"
                      value={cert.issueDate}
                      onChange={(e) =>
                        updateArrayItem("certifications", index, "issueDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="builder-field">
                    <label>Credential ID</label>
                    <input
                      placeholder="e.g. AWS-DEV-12345"
                      value={cert.credentialId}
                      onChange={(e) =>
                        updateArrayItem("certifications", index, "credentialId", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="builder-field">
                  <label>Verification URL</label>
                  <input
                    placeholder="e.g. https://aws.amazon.com/verify/..."
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      updateArrayItem("certifications", index, "credentialUrl", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL SAVE BANNER */}
        <section className="builder-final-section">
          <div className="builder-final-glow"></div>
          <div className="builder-final-icon">
            <Sparkles size={24} />
          </div>

          <div className="builder-final-content">
            <span className="final-kicker">READY TO PUBLISH</span>
            <h2>Save & Generate Your ATS-Ready Resume</h2>
            <p>
              Your structured resume will be saved to your HireSphere profile and ready for AI ATS scoring and 1-click applications.
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
                <span>Saving Resume...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Save & Create Resume</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
}

export default ResumeBuilder;