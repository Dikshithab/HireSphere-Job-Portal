import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../css/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("fullName", response.data.fullName);

      const role = response.data.role;

      console.log("Logged in role:", role);

      if (role === "EMPLOYER") {
        navigate("/employer");
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            "Invalid email or password"
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
          <span className="brand-badge">AI-POWERED CAREER PLATFORM</span>

          <h2>
            Find opportunities.
            <br />
            Build your future.
          </h2>

          <p>
            Connect with the right jobs, showcase your skills,
            and take the next step in your career with HireSphere.
          </p>

          <div className="brand-features">
            <div>
              <span className="feature-icon">✓</span>
              <span>Smart job discovery</span>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <span>AI-powered resume analysis</span>
            </div>

            <div>
              <span className="feature-icon">✓</span>
              <span>Career assistance with AI</span>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          © 2026 HireSphere
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-icon">✦</div>
            <span>HireSphere</span>
          </div>

          <div className="auth-heading">
            <span className="auth-eyebrow">WELCOME BACK</span>

            <h1>Sign in to your account</h1>

            <p>
              Continue your journey with HireSphere.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="auth-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <div className="auth-message auth-error">
              <span>!</span>
              {message}
            </div>
          )}

          <div className="auth-divider">
            <span>New to HireSphere?</span>
          </div>

          <Link to="/register" className="secondary-auth-button">
            Create an account
          </Link>

          <p className="auth-bottom-text">
            By continuing, you agree to use HireSphere responsibly
            and provide accurate information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
