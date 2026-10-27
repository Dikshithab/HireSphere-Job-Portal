import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Check,
  ArrowRight,
  AlertTriangle,
  Briefcase
} from "lucide-react";
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
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await api.post("/users/register/", payload);
      console.log("Register Response:", response.data);

      setMessage("Registration successful! Redirecting to login...");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "JOB_SEEKER",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Register Error:", error);

      if (error.response) {
        console.log("Backend Error:", error.response.data);
        setMessage(
          error.response.data?.message ||
          Object.values(error.response.data || {}).flat().join(" ") ||
          "Registration failed"
        );
      } else {
        setMessage("Cannot connect to server. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand">
          <div className="brand-icon">
            <Briefcase size={20} />
          </div>
          <span>
            Hire<span>Sphere</span>
          </span>
        </div>

        <div className="brand-content">
          <span className="brand-badge">
            <span className="brand-badge-dot" />
            START YOUR JOURNEY
          </span>

          <h2>
            Your next opportunity
            <br />
            <span>starts here.</span>
          </h2>

          <p>
            Create your HireSphere profile to access AI resume optimization,
            precision job matching, and streamlined direct applications.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-icon">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>Curated Technical Roles</strong>
                <span>Direct opportunities matched to your exact skills.</span>
              </div>
            </div>

            <div className="brand-feature">
              <span className="feature-icon">
                <Sparkles size={16} />
              </span>
              <div>
                <strong>AI Resume Analysis</strong>
                <span>Continuous ATS score diagnostics powered by Groq.</span>
              </div>
            </div>

            <div className="brand-feature">
              <span className="feature-icon">
                <Building2 size={16} />
              </span>
              <div>
                <strong>Direct Employer Network</strong>
                <span>Connect directly with actively hiring engineering teams.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <span>© 2026 HireSphere</span>
          <span className="footer-separator">•</span>
          <span>Next-gen AI recruitment</span>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-card register-card">
          <div className="mobile-brand">
            <div className="brand-icon">
              <Briefcase size={18} />
            </div>
            <span>
              Hire<span>Sphere</span>
            </span>
          </div>

          <div className="auth-heading">
            <div className="auth-eyebrow">
              <Sparkles size={12} />
              GET STARTED
            </div>

            <h1>
              Create your <span>account.</span>
            </h1>

            <p>
              Join thousands of job seekers and hiring managers on HireSphere.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="auth-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Shiva Rama"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={16} />
                </span>
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

            {/* Phone & Password Row */}
            <div className="auth-row">
              <div className="auth-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="auth-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="auth-group">
              <label>I am joining as</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={
                    formData.role === "JOB_SEEKER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() => handleRoleChange("JOB_SEEKER")}
                >
                  <span className="role-icon">
                    <User size={18} />
                  </span>
                  <span>
                    <strong>Job Seeker</strong>
                    <small>Looking for career opportunities</small>
                  </span>
                  <span className="role-check">
                    {formData.role === "JOB_SEEKER" && <Check size={14} />}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    formData.role === "EMPLOYER"
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() => handleRoleChange("EMPLOYER")}
                >
                  <span className="role-icon">
                    <Building2 size={18} />
                  </span>
                  <span>
                    <strong>Employer</strong>
                    <small>Posting jobs & hiring talent</small>
                  </span>
                  <span className="role-check">
                    {formData.role === "EMPLOYER" && <Check size={14} />}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="button-arrow" />
                </>
              )}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div
              className={`auth-message ${
                message.includes("successful")
                  ? "auth-success"
                  : "auth-error"
              }`}
            >
              <span className="message-icon">
                {message.includes("successful") ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
              </span>
              <span>{message}</span>
            </div>
          )}

          <div className="auth-divider">
            <span />
            <b>Already have an account?</b>
            <span />
          </div>

          <Link to="/login" className="secondary-auth-button">
            <span>Sign in to existing account</span>
            <ArrowRight size={15} />
          </Link>

          <p className="auth-bottom-text">
            Your information is protected by industry standard encryption and never shared without consent.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
