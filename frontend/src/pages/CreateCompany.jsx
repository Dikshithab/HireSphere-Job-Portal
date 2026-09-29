import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/CreateCompany.css";

function CreateCompany() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logoUrl: "",
  });

  const [companyExists, setCompanyExists] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // LOAD MY COMPANY
  // =====================================================

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const response = await api.get("/jobs/company/");
      const company = response.data;

      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
        logoUrl: company.logo_url || "",
      });

      setCompanyExists(true);
      setMessage("");
    } catch (error) {
      if (error.response?.status === 404) {
        setCompanyExists(false);
      } else {
        console.error("Load Company Error:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load company."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // CREATE / UPDATE COMPANY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      let response;

      if (companyExists) {
        response = await api.put(
          "/jobs/company/",
          formData
        );

        console.log(
          "Updated Company:",
          response.data
        );

        setMessage(
          "Company updated successfully!"
        );
      } else {
        response = await api.post(
          "/jobs/company/",
          formData
        );

        console.log(
          "Created Company:",
          response.data
        );

        setCompanyExists(true);

        setMessage(
          "Company created successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Company Save Error:",
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
          "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your company?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      await api.delete("/jobs/company/");

      setFormData({
        name: "",
        description: "",
        website: "",
        location: "",
        logoUrl: "",
      });

      setCompanyExists(false);

      setMessage(
        "Company deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete Company Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to delete company."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="create-company-page">
        <div className="create-company-bg-orb orb-one" />
        <div className="create-company-bg-orb orb-two" />
        <div className="create-company-bg-grid" />

        <div className="create-company-container">
          <div className="create-company-loading-card">
            <div className="loading-ai-icon">
              ✦
            </div>

            <div className="loading-spinner" />

            <h2>
              Loading your company
            </h2>

            <p>
              Please wait while we retrieve your
              company information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="create-company-page">

      {/* Background */}
      <div className="create-company-bg-orb orb-one" />
      <div className="create-company-bg-orb orb-two" />
      <div className="create-company-bg-orb orb-three" />
      <div className="create-company-bg-grid" />

      <div className="create-company-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="create-company-header">

          <div className="create-company-eyebrow">
            <span className="eyebrow-dot" />
            EMPLOYER WORKSPACE
          </div>

          <div className="create-company-title-row">

            <div>
              <h1>
                {companyExists
                  ? "Manage your "
                  : "Build your "}
                <span>
                  company profile.
                </span>
              </h1>

              <p>
                {companyExists
                  ? "Keep your company information up to date and maintain a strong presence for candidates."
                  : "Create your company profile before publishing your first job and connecting with talented candidates."}
              </p>
            </div>

            <div className="company-status-card">

              <div className="status-icon">
                {companyExists ? "✓" : "✦"}
              </div>

              <div>
                <span className="status-label">
                  PROFILE STATUS
                </span>

                <strong>
                  {companyExists
                    ? "Active"
                    : "Not created"}
                </strong>
              </div>

            </div>

          </div>

          {/* Quick info */}
          <div className="create-company-info-strip">

            <div className="info-strip-icon">
              {companyExists ? "✓" : "✦"}
            </div>

            <div className="info-strip-content">
              <strong>
                {companyExists
                  ? "Your company profile is ready"
                  : "One step closer to hiring"}
              </strong>

              <span>
                {companyExists
                  ? "You can update your company details whenever needed."
                  : "Complete your profile to start creating job listings."}
              </span>
            </div>

            <span className="info-strip-arrow">
              →
            </span>

          </div>

        </header>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div
            className={`create-company-message ${
              message.includes("successfully")
                ? "message-success"
                : "message-error"
            }`}
            role="alert"
          >
            <span className="message-icon">
              {message.includes("successfully")
                ? "✓"
                : "!"}
            </span>

            <span>{message}</span>
          </div>
        )}

        {/* =================================================
            FORM CARD
        ================================================= */}

        <section className="create-company-card">

          {/* Card Header */}
          <div className="create-company-card-header">

            <div className="card-header-icon">
              🏢
            </div>

            <div>
              <span className="card-kicker">
                COMPANY PROFILE
              </span>

              <h2>
                Company information
              </h2>

              <p>
                Give candidates a clear picture of
                your organization.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* =================================================
                SECTION 01
            ================================================= */}

            <div className="create-company-section">

              <div className="section-heading">

                <span className="section-number">
                  01
                </span>

                <div>
                  <h3>
                    About your company
                  </h3>

                  <p>
                    Start with the essential details
                    candidates need to know.
                  </p>
                </div>

              </div>

              <div className="create-company-grid">

                {/* Company Name */}
                <div className="create-form-group full-width">

                  <label htmlFor="company-name">
                    Company name
                    <span>*</span>
                  </label>

                  <div className="create-input-wrapper">

                    <span className="create-input-icon">
                      🏢
                    </span>

                    <input
                      id="company-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="TechNova Solutions"
                      required
                    />

                  </div>

                </div>

                {/* Description */}
                <div className="create-form-group full-width">

                  <div className="label-row">

                    <label htmlFor="company-description">
                      Company description
                      <span>*</span>
                    </label>

                    <span className="field-hint">
                      Tell your story
                    </span>

                  </div>

                  <textarea
                    id="company-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Software development and technology solutions company. Tell candidates about your mission, products, culture, and team..."
                    rows="6"
                    required
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                SECTION 02
            ================================================= */}

            <div className="create-company-section">

              <div className="section-heading">

                <span className="section-number">
                  02
                </span>

                <div>
                  <h3>
                    Company presence
                  </h3>

                  <p>
                    Help candidates discover more about
                    your organization.
                  </p>
                </div>

              </div>

              <div className="create-company-grid">

                {/* Website */}
                <div className="create-form-group">

                  <label htmlFor="company-website">
                    Website
                  </label>

                  <div className="create-input-wrapper">

                    <span className="create-input-icon">
                      ↗
                    </span>

                    <input
                      id="company-website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />

                  </div>

                  <small>
                    Your official company website.
                  </small>

                </div>

                {/* Location */}
                <div className="create-form-group">

                  <label htmlFor="company-location">
                    Location
                    <span>*</span>
                  </label>

                  <div className="create-input-wrapper">

                    <span className="create-input-icon">
                      ◎
                    </span>

                    <input
                      id="company-location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Hyderabad"
                      required
                    />

                  </div>

                  <small>
                    Your company's primary location.
                  </small>

                </div>

                {/* Logo */}
                <div className="create-form-group full-width">

                  <label htmlFor="company-logo">
                    Company logo URL
                  </label>

                  <div className="create-input-wrapper">

                    <span className="create-input-icon">
                      ◇
                    </span>

                    <input
                      id="company-logo"
                      type="url"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                    />

                  </div>

                  <small>
                    Optional. Add a publicly accessible
                    URL for your company logo.
                  </small>

                </div>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="create-company-actions">

              <div className="company-actions-left">

                <button
                  type="button"
                  className="create-company-cancel"
                  onClick={() =>
                    navigate("/employer")
                  }
                >
                  <span>←</span>
                  Cancel
                </button>

                {companyExists && (
                  <button
                    type="button"
                    className="delete-company-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="delete-spinner" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span>🗑</span>
                        Delete Company
                      </>
                    )}
                  </button>
                )}

              </div>

              <button
                type="submit"
                className="create-company-submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="save-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span>
                      {companyExists
                        ? "Update Company"
                        : "Create Company"}
                    </span>

                    <span className="submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>

          </form>

        </section>

        {/* Footer hint */}
        <div className="create-company-footer">

          <span>✦</span>

          <span>
            {companyExists
              ? "Your company information can be updated at any time."
              : "Once your company is created, you'll be ready to publish jobs on HireSphere."}
          </span>

        </div>

      </div>
    </div>
  );
}

export default CreateCompany;