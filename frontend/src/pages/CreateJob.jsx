import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salary: "",
    experienceLevel: "FRESHER",
  });

  // Get logged-in employer's company
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get("/jobs/company/");

        console.log("My Company:", response.data);

        setCompany(response.data);
      } catch (error) {
        console.error("Company error:", error);

        setMessage(
          error.response?.data?.message ||
            "Please create your company first."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CREATE JOB BUTTON CLICKED");
    console.log("Form data:", formData);
    console.log("Company:", company);

    if (!company) {
      setMessage("Please create your company first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        job_type: formData.jobType,
        salary: Number(formData.salary),
        experience_level: formData.experienceLevel,
      };

      console.log("Sending job data:", jobData);

      const response = await api.post("/jobs/", jobData);

      console.log(
        "Job created successfully:",
        response.data
      );

      setMessage("Job created successfully!");

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1000);
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
          "Unable to create job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-job-page">
        <div className="create-job-bg-orb job-orb-one" />
        <div className="create-job-bg-orb job-orb-two" />
        <div className="create-job-bg-grid" />

        <div className="create-job-container">
          <div className="create-job-loading-card">
            <div className="job-loading-icon">✦</div>

            <div className="job-loading-spinner" />

            <h2>Preparing your workspace</h2>

            <p>
              Loading your company information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-job-page">
      {/* Background */}
      <div className="create-job-bg-orb job-orb-one" />
      <div className="create-job-bg-orb job-orb-two" />
      <div className="create-job-bg-orb job-orb-three" />
      <div className="create-job-bg-grid" />

      <div className="create-job-container">

        {/* Header */}
        <header className="create-job-header">

          <div className="create-job-eyebrow">
            <span className="job-eyebrow-dot" />
            EMPLOYER WORKSPACE
          </div>

          <div className="create-job-title-row">

            <div className="create-job-title-content">

              <h1>
                Create your{" "}
                <span>next opportunity.</span>
              </h1>

              <p>
                Publish a job that attracts the right
                talent and helps your team grow.
              </p>

            </div>

            {company && (
              <div className="create-job-company-status">

                <div className="job-status-icon">
                  ✓
                </div>

                <div>
                  <span>POSTING AS</span>
                  <strong>{company.name}</strong>
                </div>

              </div>
            )}

          </div>

          <div className="create-job-info-strip">

            <div className="job-info-icon">
              ✦
            </div>

            <div className="job-info-content">

              <strong>
                Ready to find your next hire?
              </strong>

              <span>
                Add clear job details so candidates
                know exactly what you're looking for.
              </span>

            </div>

            <span className="job-info-arrow">
              →
            </span>

          </div>

        </header>

        {/* Message */}
        {message && (
          <div
            className={`create-job-message ${
              message.includes("successfully")
                ? "job-message-success"
                : "job-message-error"
            }`}
            role="alert"
          >
            <span className="job-message-icon">
              {message.includes("successfully")
                ? "✓"
                : "!"}
            </span>

            <span>{message}</span>
          </div>
        )}

        {/* Company */}
        {company && (
          <div className="create-job-company-card">

            <div className="company-card-icon">
              🏢
            </div>

            <div className="company-card-content">
              <span>POSTING FOR</span>
              <strong>{company.name}</strong>
            </div>

            <div className="company-card-status">
              <span className="status-dot" />
              Active
            </div>

          </div>
        )}

        {/* Main Form Card */}
        <section className="create-job-card">

          <div className="create-job-card-header">

            <div className="job-card-header-icon">
              ✦
            </div>

            <div>
              <span className="job-card-kicker">
                JOB POSTING
              </span>

              <h2>
                Position details
              </h2>

              <p>
                Give candidates everything they need
                to understand the opportunity.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Section 01 */}
            <div className="create-job-section">

              <div className="job-section-heading">

                <span className="job-section-number">
                  01
                </span>

                <div>
                  <h3>
                    About the role
                  </h3>

                  <p>
                    Start with the core information
                    about this position.
                  </p>
                </div>

              </div>

              <div className="create-job-grid">

                {/* Job Title */}
                <div className="create-job-form-group full-width">

                  <label htmlFor="job-title">
                    Job title
                    <span>*</span>
                  </label>

                  <div className="job-input-wrapper">

                    <span className="job-input-icon">
                      ✦
                    </span>

                    <input
                      id="job-title"
                      type="text"
                      name="title"
                      placeholder="e.g. Python Full Stack Developer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <small>
                    Use a clear and searchable job title.
                  </small>

                </div>

                {/* Description */}
                <div className="create-job-form-group full-width">

                  <div className="job-label-row">

                    <label htmlFor="job-description">
                      Job description
                      <span>*</span>
                    </label>

                    <span className="job-field-hint">
                      Tell the story
                    </span>

                  </div>

                  <textarea
                    id="job-description"
                    name="description"
                    placeholder="Describe the role, responsibilities, team, projects and what the candidate will work on..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    required
                  />

                </div>

                {/* Requirements */}
                <div className="create-job-form-group full-width">

                  <div className="job-label-row">

                    <label htmlFor="job-requirements">
                      Requirements
                      <span>*</span>
                    </label>

                    <span className="job-field-hint">
                      Skills & qualifications
                    </span>

                  </div>

                  <textarea
                    id="job-requirements"
                    name="requirements"
                    placeholder="Python, Django, React, SQL, REST APIs..."
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="5"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Section 02 */}
            <div className="create-job-section">

              <div className="job-section-heading">

                <span className="job-section-number">
                  02
                </span>

                <div>
                  <h3>
                    Opportunity details
                  </h3>

                  <p>
                    Help candidates understand the
                    position, location and seniority.
                  </p>
                </div>

              </div>

              <div className="create-job-grid">

                {/* Location */}
                <div className="create-job-form-group">

                  <label htmlFor="job-location">
                    Location
                    <span>*</span>
                  </label>

                  <div className="job-input-wrapper">

                    <span className="job-input-icon">
                      ◎
                    </span>

                    <input
                      id="job-location"
                      type="text"
                      name="location"
                      placeholder="Hyderabad"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <small>
                    Where will the candidate work?
                  </small>

                </div>

                {/* Salary */}
                <div className="create-job-form-group">

                  <label htmlFor="job-salary">
                    Salary
                    <span>*</span>
                  </label>

                  <div className="job-input-wrapper salary-input">

                    <span className="salary-prefix">
                      ₹
                    </span>

                    <input
                      id="job-salary"
                      type="number"
                      name="salary"
                      placeholder="600000"
                      value={formData.salary}
                      onChange={handleChange}
                      min="0"
                      required
                    />

                  </div>

                  <small>
                    Enter the annual salary in INR.
                  </small>

                </div>

                {/* Job Type */}
                <div className="create-job-form-group">

                  <label htmlFor="job-type">
                    Job type
                  </label>

                  <div className="job-select-wrapper">

                    <span className="job-select-icon">
                      ◈
                    </span>

                    <select
                      id="job-type"
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
                <div className="create-job-form-group">

                  <label htmlFor="experience-level">
                    Experience level
                  </label>

                  <div className="job-select-wrapper">

                    <span className="job-select-icon">
                      ◉
                    </span>

                    <select
                      id="experience-level"
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
            <div className="create-job-actions">

              <button
                type="button"
                className="create-job-cancel"
                onClick={() =>
                  navigate("/employer")
                }
              >
                <span>←</span>
                Cancel
              </button>

              <button
                type="submit"
                className="create-job-submit"
                disabled={saving || !company}
              >
                {saving ? (
                  <>
                    <span className="job-save-spinner" />
                    Creating...
                  </>
                ) : (
                  <>
                    <span>
                      Create Job
                    </span>

                    <span className="job-submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>

          </form>

        </section>

        {/* Footer */}
        <div className="create-job-footer">

          <span>✦</span>

          <span>
            Your job will be visible to candidates
            once it has been successfully created.
          </span>

        </div>

      </div>

    </div>
  );
}

export default CreateJob;