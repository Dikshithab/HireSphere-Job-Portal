import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "JOB_SEEKER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/users/register",
        formData
      );

      console.log("Register Response:", response.data);

      setMessage("Registration successful!");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "JOB_SEEKER",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register Error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            "Registration failed"
        );
      } else {
        setMessage("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand">
          <div className="brand-icon">✦</div>
          <span>HireSphere</span>
        </div>

        <div className="brand-content">
          <span className="brand-badge">START YOUR JOURNEY</span>

          <h2>
            Your next opportunity
            <br />
            starts here.
          </h2>

          <p>
            Create your HireSphere account and discover
            opportunities designed around your career goals.
          </p>

          <div className="brand-features">
            <div>
              <span className="feature-icon">✓</span>
              <span>Discover relevant jobs</span>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <span>Improve your resume with AI</span>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <span>Connect with employers</span>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          © 2026 HireSphere
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card register-card">
          <div className="mobile-brand">
            <div className="brand-icon">✦</div>
            <span>HireSphere</span>
          </div>

          <div className="auth-heading">
            <span className="auth-eyebrow">GET STARTED</span>

            <h1>Create your account</h1>

            <p>
              Join HireSphere and take the next step in your career.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="auth-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <span className="input-icon">◯</span>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-group">
                <label>Phone number</label>

                <div className="input-wrapper">
                  <span className="input-icon">☎</span>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="auth-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>
            </div>

            <div className="auth-group">
              <label>Account type</label>

              <div className="role-selector">
                <button
                  type="button"
                  className={
                    formData.role === "JOB_SEEKER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() =>
                    handleRoleChange("JOB_SEEKER")
                  }
                >
                  <span className="role-icon">👤</span>

                  <span>
                    <strong>Job Seeker</strong>
                    <small>Find your next opportunity</small>
                  </span>

                  <span className="role-check">
                    {formData.role === "JOB_SEEKER"
                      ? "✓"
                      : ""}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    formData.role === "EMPLOYER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() =>
                    handleRoleChange("EMPLOYER")
                  }
                >
                  <span className="role-icon">🏢</span>

                  <span>
                    <strong>Employer</strong>
                    <small>Find talented candidates</small>
                  </span>

                  <span className="role-check">
                    {formData.role === "EMPLOYER"
                      ? "✓"
                      : ""}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`auth-message ${
                message.includes("successful")
                  ? "auth-success"
                  : "auth-error"
              }`}
            >
              <span>
                {message.includes("successful") ? "✓" : "!"}
              </span>

              {message}
            </div>
          )}

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="secondary-auth-button">
            Sign in instead
          </Link>

          <p className="auth-bottom-text">
            Your information is securely handled by HireSphere.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
