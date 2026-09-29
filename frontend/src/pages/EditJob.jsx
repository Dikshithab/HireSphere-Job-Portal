import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salary: "",
    experienceLevel: "FRESHER",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD JOB
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}/`);

        console.log("Job:", response.data);

        const job = response.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements || "",
          location: job.location || "",
          jobType: convertJobType(job.job_type),
          salary: job.salary ?? "",
          experienceLevel:
            job.experience_level || "FRESHER",
        });
      } catch (error) {
        console.error("Error loading job:", error);
        console.error(
          "Status:",
          error.response?.status
        );
        console.error(
          "Data:",
          error.response?.data
        );

        setMessage(
          error.response?.data?.message ||
            "Unable to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // CONVERT JOB TYPE
  // ==========================================

  const convertJobType = (value) => {
    if (!value) {
      return "FULL_TIME";
    }

    const type = value.toString().toLowerCase();

    if (type.includes("part")) {
      return "PART_TIME";
    }

    if (type.includes("intern")) {
      return "INTERNSHIP";
    }

    if (type.includes("contract")) {
      return "CONTRACT";
    }

    return "FULL_TIME";
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await api.put(
        `/jobs/${id}/manage/`,
        {
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,

          job_type: formData.jobType,

          salary: Number(formData.salary),

          experience_level:
            formData.experienceLevel,
        }
      );

      console.log(
        "Updated job:",
        response.data
      );

      setMessage(
        "Job updated successfully!"
      );

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1000);
    } catch (error) {
      console.error(
        "Update job error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Data:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-job-page">
        <div className="edit-job-bg-orb edit-orb-one" />
        <div className="edit-job-bg-orb edit-orb-two" />
        <div className="edit-job-bg-grid" />

        <div className="edit-job-container">
          <div className="edit-job-loading-card">

            <div className="edit-loading-icon">
              ✦
            </div>

            <div className="edit-loading-spinner" />

            <h2>
              Loading job details
            </h2>

            <p>
              Preparing your job posting for editing...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="edit-job-page">

      {/* Background */}
      <div className="edit-job-bg-orb edit-orb-one" />
      <div className="edit-job-bg-orb edit-orb-two" />
      <div className="edit-job-bg-orb edit-orb-three" />
      <div className="edit-job-bg-grid" />

      <div className="edit-job-container">

        {/* Header */}
        <header className="edit-job-header">

          <div className="edit-job-eyebrow">
            <span className="edit-eyebrow-dot" />
            EMPLOYER WORKSPACE
          </div>

          <div className="edit-job-title-row">

            <div className="edit-job-title-content">

              <h1>
                Refine your{" "}
                <span>job posting.</span>
              </h1>

              <p>
                Keep your opportunity accurate,
                relevant and ready for the right
                candidates.
              </p>

            </div>

            <div className="edit-job-id-card">

              <div className="edit-job-id-icon">
                ✎
              </div>

              <div>
                <span>EDITING POSTING</span>
                <strong>Job #{id}</strong>
              </div>

            </div>

          </div>

          <div className="edit-job-info-strip">

            <div className="edit-info-icon">
              ✦
            </div>

            <div className="edit-info-content">

              <strong>
                Make your posting stronger
              </strong>

              <span>
                Update responsibilities, skills,
                compensation or experience requirements.
              </span>

            </div>

            <span className="edit-info-arrow">
              →
            </span>

          </div>

        </header>

        {/* Message */}
        {message && (
          <div
            className={`edit-job-message ${
              message.includes("successfully")
                ? "edit-message-success"
                : "edit-message-error"
            }`}
            role="alert"
          >
            <span className="edit-message-icon">
              {message.includes("successfully")
                ? "✓"
                : "!"}
            </span>

            <span>{message}</span>
          </div>
        )}

        {/* Main Card */}
        <section className="edit-job-card">

          <div className="edit-job-card-header">

            <div className="edit-card-header-icon">
              ✎
            </div>

            <div>
              <span className="edit-card-kicker">
                JOB POSTING
              </span>

              <h2>
                Update position details
              </h2>

              <p>
                Review and update the information
                candidates see.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* =====================================
                SECTION 01
            ====================================== */}

            <div className="edit-job-section">

              <div className="edit-section-heading">

                <span className="edit-section-number">
                  01
                </span>

                <div>
                  <h3>
                    About the role
                  </h3>

                  <p>
                    Update the core information
                    about this opportunity.
                  </p>
                </div>

              </div>

              <div className="edit-job-grid">

                {/* Job Title */}
                <div className="edit-form-group full-width">

                  <label htmlFor="edit-job-title">
                    Job title
                    <span>*</span>
                  </label>

                  <div className="edit-input-wrapper">

                    <span className="edit-input-icon">
                      ✦
                    </span>

                    <input
                      id="edit-job-title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Python Full Stack Developer"
                      required
                    />

                  </div>

                  <small>
                    Keep the title clear and
                    searchable.
                  </small>

                </div>

                {/* Description */}
                <div className="edit-form-group full-width">

                  <div className="edit-label-row">

                    <label htmlFor="edit-description">
                      Job description
                      <span>*</span>
                    </label>

                    <span className="edit-field-hint">
                      Tell the story
                    </span>

                  </div>

                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the role, responsibilities and what the candidate will work on..."
                    required
                  />

                </div>

                {/* Requirements */}
                <div className="edit-form-group full-width">

                  <div className="edit-label-row">

                    <label htmlFor="edit-requirements">
                      Requirements
                      <span>*</span>
                    </label>

                    <span className="edit-field-hint">
                      Skills & qualifications
                    </span>

                  </div>

                  <textarea
                    id="edit-requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Python, Django, React, SQL, REST APIs..."
                    required
                  />

                </div>

              </div>

            </div>

            {/* =====================================
                SECTION 02
            ====================================== */}

            <div className="edit-job-section">

              <div className="edit-section-heading">

                <span className="edit-section-number">
                  02
                </span>

                <div>
                  <h3>
                    Opportunity details
                  </h3>

                  <p>
                    Update location, salary and
                    experience requirements.
                  </p>
                </div>

              </div>

              <div className="edit-job-grid">

                {/* Location */}
                <div className="edit-form-group">

                  <label htmlFor="edit-location">
                    Location
                    <span>*</span>
                  </label>

                  <div className="edit-input-wrapper">

                    <span className="edit-input-icon">
                      ◎
                    </span>

                    <input
                      id="edit-location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Hyderabad"
                      required
                    />

                  </div>

                  <small>
                    Primary work location.
                  </small>

                </div>

                {/* Salary */}
                <div className="edit-form-group">

                  <label htmlFor="edit-salary">
                    Salary
                    <span>*</span>
                  </label>

                  <div className="edit-input-wrapper salary-wrapper">

                    <span className="salary-prefix">
                      ₹
                    </span>

                    <input
                      id="edit-salary"
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      min="0"
                      placeholder="600000"
                      required
                    />

                  </div>

                  <small>
                    Annual salary in INR.
                  </small>

                </div>

                {/* Job Type */}
                <div className="edit-form-group">

                  <label htmlFor="edit-job-type">
                    Job type
                  </label>

                  <div className="edit-select-wrapper">

                    <span className="edit-select-icon">
                      ◈
                    </span>

                    <select
                      id="edit-job-type"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                    >
                      <option value="FULL_TIME">
                        Full Time
                      </option>

                      <option value="PART_TIME">
                        Part Time
                      </option>

                      <option value="INTERNSHIP">
                        Internship
                      </option>

                      <option value="CONTRACT">
                        Contract
                      </option>
                    </select>

                  </div>

                </div>

                {/* Experience */}
                <div className="edit-form-group">

                  <label htmlFor="edit-experience">
                    Experience level
                  </label>

                  <div className="edit-select-wrapper">

                    <span className="edit-select-icon">
                      ◉
                    </span>

                    <select
                      id="edit-experience"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                    >
                      <option value="FRESHER">
                        Fresher
                      </option>

                      <option value="JUNIOR">
                        Junior
                      </option>

                      <option value="MID">
                        Mid Level
                      </option>

                      <option value="SENIOR">
                        Senior
                      </option>
                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="edit-job-actions">

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() =>
                  navigate("/employer/jobs")
                }
              >
                <span>←</span>
                Cancel
              </button>

              <button
                type="submit"
                className="edit-update-job-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="edit-save-spinner" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span>
                      Update Job
                    </span>

                    <span className="edit-submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>

          </form>

        </section>

        {/* Footer */}
        <div className="edit-job-footer">

          <span>✦</span>

          <span>
            Changes will be reflected in your
            job listing after the update.
          </span>

        </div>

      </div>

    </div>
  );
}

export default EditJob;