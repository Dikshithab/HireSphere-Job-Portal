import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";
import "../css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Atmosphere */}
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-grid" />

      {/* BRAND PANEL */}
      <aside className="auth-brand-panel">
        <div className="auth-brand">
          <div className="brand-icon">
            <Briefcase size={20} />
          </div>
          <span>
            Hire<span>Sphere</span>
          </span>
        </div>

        <div className="brand-content">
          <div className="brand-badge">
            <span className="brand-badge-dot" />
            INTELLIGENT RECRUITMENT PLATFORM
          </div>

          <h2>
            Find the work
            <br />
            <span>you love.</span>
          </h2>

          <p>
            Discover high-growth career opportunities, benchmark your skills with Groq AI,
            and match directly with engineering-focused teams.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-icon">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>Smart Job Discovery</strong>
                <span>Instant semantic matching calibrated to your resume.</span>
              </div>
            </div>

            <div className="brand-feature">
              <span className="feature-icon">
                <Sparkles size={16} />
              </span>
              <div>
                <strong>AI Resume & ATS Optimization</strong>
                <span>Score higher with instant keyword gap analysis.</span>
              </div>
            </div>

            <div className="brand-feature">
              <span className="feature-icon">
                <Building2 size={16} />
              </span>
              <div>
                <strong>Direct Employer Channels</strong>
                <span>Fast-track hiring with verified company postings.</span>
              </div>
            </div>
          </div>

          <div className="brand-ai-card">
            <div className="brand-ai-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="brand-ai-label">HIRESPHERE AI INTELLIGENCE</span>
              <p>Powered by Groq high-speed LLM processing</p>
            </div>
            <span className="brand-ai-arrow">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>

        <div className="brand-footer">
          <span>© 2026 HireSphere</span>
          <span className="footer-separator">•</span>
          <span>Next-gen AI career platform</span>
        </div>
      </aside>

      {/* FORM PANEL */}
      <main className="auth-form-panel">
        <div className="auth-card">
          {/* Mobile Brand */}
          <div className="mobile-brand">
            <div className="brand-icon">
              <Briefcase size={18} />
            </div>
            <span>
              Hire<span>Sphere</span>
            </span>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <div className="auth-eyebrow">
              <Sparkles size={12} />
              WELCOME BACK
            </div>

            <h1>
              Sign in to your <span>account.</span>
            </h1>

            <p>
              Continue your journey with HireSphere and explore your personalized matches.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="auth-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <Mail size={16} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-group">
              <div className="password-label-row">
                <label htmlFor="login-password">Password</label>
                <span className="secure-label">
                  <span className="live-dot-mini" />
                  Secure TLS Encrypted
                </span>
              </div>

              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-message auth-error" role="alert">
                <span className="message-icon">
                  <AlertTriangle size={16} />
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="button-arrow" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span />
              <b>OR</b>
              <span />
            </div>

            {/* Register Link */}
            <Link to="/register" className="secondary-auth-button">
              <span>Create a new account</span>
              <ArrowRight size={15} />
            </Link>

            <p className="auth-bottom-text">
              By continuing, you agree to HireSphere's <span>Terms of Service</span> and <span>Privacy Policy</span>.
            </p>
          </form>

          {/* Trust Footer */}
          <div className="auth-trust">
            <ShieldCheck size={16} className="trust-icon" />
            <span>Protected with end-to-end JWT token encryption</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;