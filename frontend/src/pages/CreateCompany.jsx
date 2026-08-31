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
      const response = await api.get("/companies/my");

      const company = response.data;

      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
        logoUrl: company.logoUrl || "",
      });

      setCompanyExists(true);
      setMessage("");
    } catch (error) {
      // 404 means employer doesn't have a company yet
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
        // UPDATE
        response = await api.put(
          "/companies/my",
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
        // CREATE
        response = await api.post(
          "/companies",
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
      await api.delete("/companies");

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
        <div className="create-company-container">

          <div className="create-company-card">
            <div className="create-company-section">
              <h2>Loading Company...</h2>

              <p>
                Please wait while we load your
                company information.
              </p>
            </div>
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

      <div className="create-company-container">

        {/* HEADER */}

        <div className="create-company-header">

          <span className="create-company-eyebrow">
            EMPLOYER
          </span>

          <h1>
            {companyExists
              ? "Manage Your Company"
              : "Create Your Company"}
          </h1>

          <p>
            {companyExists
              ? "Update your company information whenever you need."
              : "Add your company information before creating your first job posting."}
          </p>

        </div>


        {/* MESSAGE */}

        {message && (
          <div className="create-company-message">

            <span>✓</span>

            {message}

          </div>
        )}


        {/* FORM CARD */}

        <div className="create-company-card">

          <form onSubmit={handleSubmit}>

            {/* SECTION HEADER */}

            <div className="create-company-section">

              <h2>
                Company Information
              </h2>

              <p>
                Provide accurate information so
                candidates can learn about your company.
              </p>

            </div>


            <div className="create-company-grid">

              {/* COMPANY NAME */}

              <div className="create-form-group full-width">

                <label>
                  Company Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="TechNova Solutions"
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="create-form-group full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Software development and technology solutions company."
                  rows="5"
                  required
                />

              </div>


              {/* WEBSITE */}

              <div className="create-form-group">

                <label>
                  Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />

              </div>


              {/* LOCATION */}

              <div className="create-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Hyderabad"
                  required
                />

              </div>


              {/* LOGO */}

              <div className="create-form-group full-width">

                <label>
                  Logo URL
                </label>

                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />

                <small>
                  Optional. Add a publicly accessible
                  URL for your company logo.
                </small>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="create-company-actions">

              <button
                type="button"
                className="create-company-cancel"
                onClick={() => navigate("/employer")}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="create-company-submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : companyExists
                  ? "Update Company"
                  : "Create Company"}
              </button>


              {/* DELETE */}

              {companyExists && (
                <button
                  type="button"
                  className="delete-company-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "🗑️ Delete Company"}
                </button>
              )}

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateCompany;