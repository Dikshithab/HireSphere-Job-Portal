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

    const token = localStorage.getItem("token");

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/companies",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

    <div className="company-container">

      <div className="company-header">
        <span className="company-eyebrow">
          EMPLOYER PROFILE
        </span>

        <h1>Create Your Company</h1>

        <p>
          Add your company details to start posting jobs
          and attracting talented candidates.
        </p>
      </div>

      {message && (
        <div className="company-message">
          {message}
        </div>
      )}

      <div className="company-card">

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h2>Company Information</h2>
            <p>
              Tell candidates about your company.
            </p>
          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Company Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. TechNova Solutions"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell candidates about your company..."
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Website</label>

              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hyderabad"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Logo URL</label>

              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />

              <small>
                Optional. Add a public URL for your company logo.
              </small>
            </div>

          </div>

          <div className="company-actions">

            <button
              type="submit"
              className="create-company-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Company"}
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
);
}
export default Company;