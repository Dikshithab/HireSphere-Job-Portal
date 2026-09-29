import { useState } from "react";
import api from "../services/api";
import "../css/Company.css";

function Company() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logoUrl: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        location: formData.location,
        logo_url: formData.logoUrl,
      };

      const response = await api.post(
        "/jobs/company/",
        payload
      );

      console.log("Company:", response.data);

      setMessage("Company created successfully!");

      setFormData({
        name: "",
        description: "",
        website: "",
        location: "",
        logoUrl: "",
      });
    } catch (error) {
      console.error("Company error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create company."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-page">
      {/* Background effects */}
      <div className="company-bg-orb company-bg-orb-one" />
      <div className="company-bg-orb company-bg-orb-two" />
      <div className="company-bg-grid" />

      <div className="company-container">

        {/* Header */}
        <header className="company-header">
          <div className="company-eyebrow">
            <span className="eyebrow-dot" />
            EMPLOYER PROFILE
          </div>

          <div className="company-title-row">
            <div>
              <h1>
                Build your
                <span> company profile.</span>
              </h1>

              <p>
                Introduce your company to talented candidates
                and create a stronger employer presence on
                HireSphere.
              </p>
            </div>

            <div className="company-header-icon">
              <span>🏢</span>
            </div>
          </div>

          {/* Progress / info strip */}
          <div className="company-info-strip">
            <div className="info-strip-icon">✦</div>

            <div>
              <strong>
                Make your company stand out
              </strong>

              <span>
                Complete your profile before posting jobs
                to attract the right candidates.
              </span>
            </div>

            <span className="info-strip-arrow">→</span>
          </div>
        </header>

        {/* Message */}
        {message && (
          <div
            className={`company-message ${
              message.includes("successfully")
                ? "company-success"
                : "company-error"
            }`}
            role="alert"
          >
            <span className="message-status-icon">
              {message.includes("successfully")
                ? "✓"
                : "!"}
            </span>

            <span>{message}</span>
          </div>
        )}

        {/* Main Card */}
        <section className="company-card">

          <div className="company-card-top">
            <div className="company-card-icon">
              ◈
            </div>

            <div>
              <span className="card-kicker">
                COMPANY DETAILS
              </span>

              <h2>
                Tell candidates about your company
              </h2>

              <p>
                Add the information candidates need to
                understand your organization.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Basic Information */}
            <div className="company-section">
              <div className="section-heading">
                <span className="section-number">
                  01
                </span>

                <div>
                  <h3>Basic information</h3>

                  <p>
                    Start with the essentials about your
                    organization.
                  </p>
                </div>
              </div>

              <div className="company-form-grid">

                {/* Company Name */}
                <div className="company-form-group full-width">
                  <label htmlFor="company-name">
                    Company name
                    <span>*</span>
                  </label>

                  <div className="company-input-wrapper">
                    <span
                      className="company-input-icon"
                      aria-hidden="true"
                    >
                      🏢
                    </span>

                    <input
                      id="company-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. TechNova Solutions"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="company-form-group full-width">
                  <div className="label-row">
                    <label htmlFor="company-description">
                      Company description
                      <span>*</span>
                    </label>

                    <span className="field-hint">
                      Tell your story
                    </span>
                  </div>

                  <div className="company-textarea-wrapper">
                    <textarea
                      id="company-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell candidates about your company, culture, products, mission, and what makes your team unique..."
                      rows="6"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact / Location */}
            <div className="company-section">
              <div className="section-heading">
                <span className="section-number">
                  02
                </span>

                <div>
                  <h3>Online presence</h3>

                  <p>
                    Help candidates learn more about your
                    organization.
                  </p>
                </div>
              </div>

              <div className="company-form-grid">

                {/* Website */}
                <div className="company-form-group">
                  <label htmlFor="company-website">
                    Website
                  </label>

                  <div className="company-input-wrapper">
                    <span
                      className="company-input-icon"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

                    <input
                      id="company-website"
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>

                  <small>
                    Add your official company website.
                  </small>
                </div>

                {/* Location */}
                <div className="company-form-group">
                  <label htmlFor="company-location">
                    Location
                    <span>*</span>
                  </label>

                  <div className="company-input-wrapper">
                    <span
                      className="company-input-icon"
                      aria-hidden="true"
                    >
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
                    Where is your company based?
                  </small>
                </div>

                {/* Logo URL */}
                <div className="company-form-group full-width">
                  <label htmlFor="company-logo">
                    Company logo URL
                  </label>

                  <div className="company-input-wrapper">
                    <span
                      className="company-input-icon"
                      aria-hidden="true"
                    >
                      ◇
                    </span>

                    <input
                      id="company-logo"
                      type="text"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <small>
                    Optional. Add a public URL for your
                    company logo.
                  </small>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="company-actions">

              <div className="company-security">
                <span>🔒</span>

                <div>
                  <strong>Your information is secure</strong>
                  <small>
                    You can update your company details
                    later.
                  </small>
                </div>
              </div>

              <button
                type="submit"
                className="create-company-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="company-spinner" />
                    Creating...
                  </>
                ) : (
                  <>
                    <span>Create Company</span>
                    <span className="create-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>
          </form>
        </section>

        {/* Bottom hint */}
        <div className="company-footer-note">
          <span>✦</span>
          <span>
            Once your company profile is ready, you can
            start creating job listings on HireSphere.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Company;