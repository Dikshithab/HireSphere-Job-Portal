
import React, { useState } from "react";
import api from "../services/api";
import "../css/ResumeBuilder.css";

function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleTemplateChange = (template) => {
  setSelectedTemplate(template);
};
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
    skills: []
  });


  // ==========================================
  // BASIC FIELD CHANGE
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // ==========================================
  // ADD SECTION
  // ==========================================

  const addEducation = () => {

    setForm(prev => ({
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
          description: ""
        }
      ]
    }));
  };


  const addExperience = () => {

    setForm(prev => ({
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
          description: ""
        }
      ]
    }));
  };


  const addProject = () => {

    setForm(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          projectName: "",
          technologies: "",
          projectUrl: "",
          description: ""
        }
      ]
    }));
  };


  const addCertification = () => {

    setForm(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          issuingOrganization: "",
          issueDate: "",
          credentialId: "",
          credentialUrl: ""
        }
      ]
    }));
  };


  const addSkill = () => {

    setForm(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          skillName: "",
          category: ""
        }
      ]
    }));
  };


  // ==========================================
  // UPDATE ARRAY ITEM
  // ==========================================

  const updateArrayItem = (
    section,
    index,
    field,
    value
  ) => {

    setForm(prev => {

      const updated = [...prev[section]];

      updated[index] = {
        ...updated[index],
        [field]: value
      };

      return {
        ...prev,
        [section]: updated
      };
    });
  };


  // ==========================================
  // REMOVE ARRAY ITEM
  // ==========================================

  const removeArrayItem = (
    section,
    index
  ) => {

    setForm(prev => ({
      ...prev,
      [section]: prev[section].filter(
        (_, i) => i !== index
      )
    }));
  };


  // ==========================================
  // SAVE RESUME
  // ==========================================

  const saveResume = async () => {

    setSaving(true);
    setMessage("");
    setError("");

    try {

      const response =
        await api.post(
          "/resume-builder",
          {
            ...form,
            template: selectedTemplate
          }
        );

      setMessage(
        response.data?.message ||
        "Resume created successfully!"
      );

    } catch (err) {

      console.error(
        "Resume Builder Error:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create resume.";

      setError(errorMessage);

    } finally {

      setSaving(false);
    }
  };


  return (

    <div className="resume-builder-page">

      <div className="resume-builder-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="resume-builder-header">

          <div>
            <h1>Create Your Resume</h1>

            <p>
              Build a professional,
              ATS-friendly resume directly
              inside JobPortal.
            </p>
          </div>

          <button
            className="save-resume-btn"
            onClick={saveResume}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Resume"}
          </button>

        </div>


        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

<div className="template-section">

  <div className="template-section-header">
    <div>
      <span className="builder-eyebrow">
        RESUME DESIGN
      </span>

      <h2>Choose Your Template</h2>

      <p>
        Select a professional design for your resume.
      </p>
    </div>
  </div>


  <div className="template-grid">

    {/* MODERN */}

    <div
      className={`template-card ${
        selectedTemplate === "modern"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        handleTemplateChange("modern")
      }
    >

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
          <p>Clean & developer friendly</p>
        </div>

        {selectedTemplate === "modern" && (
          <span className="template-check">
            ✓
          </span>
        )}
      </div>

    </div>


    {/* CLASSIC */}

    <div
      className={`template-card ${
        selectedTemplate === "classic"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        handleTemplateChange("classic")
      }
    >

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
          <p>Traditional ATS friendly</p>
        </div>

        {selectedTemplate === "classic" && (
          <span className="template-check">
            ✓
          </span>
        )}

      </div>

    </div>


    {/* PROFESSIONAL */}

    <div
      className={`template-card ${
        selectedTemplate === "professional"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        handleTemplateChange("professional")
      }
    >

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
          <p>Corporate & polished</p>
        </div>

        {selectedTemplate === "professional" && (
          <span className="template-check">
            ✓
          </span>
        )}

      </div>

    </div>


    {/* MINIMAL */}

    <div
      className={`template-card ${
        selectedTemplate === "minimal"
          ? "selected"
          : ""
      }`}
      onClick={() =>
        handleTemplateChange("minimal")
      }
    >

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
          <p>Simple & elegant</p>
        </div>

        {selectedTemplate === "minimal" && (
          <span className="template-check">
            ✓
          </span>
        )}

      </div>

    </div>

  </div>

</div>

        {/* =====================================
            PERSONAL INFORMATION
        ====================================== */}

        <section className="builder-section">

          <h2>👤 Personal Information</h2>

          <div className="form-grid">

            <input
              name="title"
              placeholder="Resume Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <input
              name="linkedin"
              placeholder="LinkedIn URL"
              value={form.linkedin}
              onChange={handleChange}
            />

            <input
              name="github"
              placeholder="GitHub URL"
              value={form.github}
              onChange={handleChange}
            />

            <input
              name="portfolio"
              placeholder="Portfolio URL"
              value={form.portfolio}
              onChange={handleChange}
            />

          </div>

        </section>


        {/* =====================================
            SUMMARY
        ====================================== */}

        <section className="builder-section">

          <h2>📝 Professional Summary</h2>

          <textarea
            name="summary"
            placeholder="Write a short professional summary..."
            value={form.summary}
            onChange={handleChange}
            rows="5"
          />

        </section>


        {/* =====================================
            SKILLS
        ====================================== */}

        <section className="builder-section">

          <div className="section-heading">

            <h2>🛠 Skills</h2>

            <button
              type="button"
              onClick={addSkill}
            >
              + Add Skill
            </button>

          </div>

          {form.skills.map((skill, index) => (

            <div
              className="dynamic-card"
              key={index}
            >

              <input
                placeholder="Skill"
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

              <input
                placeholder="Category (Programming, Framework, Database...)"
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
                Remove
              </button>

            </div>

          ))}

        </section>


        {/* =====================================
            EDUCATION
        ====================================== */}

        <section className="builder-section">

          <div className="section-heading">

            <h2>🎓 Education</h2>

            <button
              type="button"
              onClick={addEducation}
            >
              + Add Education
            </button>

          </div>

          {form.education.map((education, index) => (

            <div
              className="dynamic-card"
              key={index}
            >

              <div className="form-grid">

                <input
                  placeholder="Degree"
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

                <input
                  placeholder="Institution"
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

                <input
                  placeholder="Field of Study"
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

                <input
                  placeholder="Start Year"
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

                <input
                  placeholder="End Year"
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

                <input
                  placeholder="Grade / CGPA"
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

              <textarea
                placeholder="Education description"
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
                Remove Education
              </button>

            </div>

          ))}

        </section>


        {/* =====================================
            EXPERIENCE
        ====================================== */}

        <section className="builder-section">

          <div className="section-heading">

            <h2>💼 Experience</h2>

            <button
              type="button"
              onClick={addExperience}
            >
              + Add Experience
            </button>

          </div>

          {form.experience.map((experience, index) => (

            <div
              className="dynamic-card"
              key={index}
            >

              <div className="form-grid">

                <input
                  placeholder="Job Title"
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

                <input
                  placeholder="Company"
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

                <input
                  placeholder="Location"
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

                <input
                  placeholder="Start Date"
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

                <input
                  placeholder="End Date"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateArrayItem(
                      "experience",
                      index,
                      "endDate",
                      e.target.value
                    )
                  }
                />

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

                Currently working here

              </label>

              <textarea
                placeholder="Describe your responsibilities and achievements..."
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
                Remove Experience
              </button>

            </div>

          ))}

        </section>


        {/* =====================================
            PROJECTS
        ====================================== */}

        <section className="builder-section">

          <div className="section-heading">

            <h2>🚀 Projects</h2>

            <button
              type="button"
              onClick={addProject}
            >
              + Add Project
            </button>

          </div>

          {form.projects.map((project, index) => (

            <div
              className="dynamic-card"
              key={index}
            >

              <input
                placeholder="Project Name"
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

              <input
                placeholder="Technologies (Java, React, MySQL...)"
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

              <input
                placeholder="Project URL"
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

              <textarea
                placeholder="Describe your project..."
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
                Remove Project
              </button>

            </div>

          ))}

        </section>


        {/* =====================================
            CERTIFICATIONS
        ====================================== */}

        <section className="builder-section">

          <div className="section-heading">

            <h2>🏆 Certifications</h2>

            <button
              type="button"
              onClick={addCertification}
            >
              + Add Certification
            </button>

          </div>

          {form.certifications.map(
            (certification, index) => (

              <div
                className="dynamic-card"
                key={index}
              >

                <div className="form-grid">

                  <input
                    placeholder="Certification Name"
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

                  <input
                    placeholder="Issuing Organization"
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

                  <input
                    placeholder="Issue Date"
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

                  <input
                    placeholder="Credential URL"
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
                  Remove Certification
                </button>

              </div>

            )
          )}

        </section>


        {/* =====================================
            FINAL SAVE
        ====================================== */}

        <div className="final-save">

          <button
            className="save-resume-btn"
            onClick={saveResume}
            disabled={saving}
          >
            {saving
              ? "Saving Resume..."
              : "✓ Create My Resume"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResumeBuilder;
