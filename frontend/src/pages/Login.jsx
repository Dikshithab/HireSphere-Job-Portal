import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* =====================================================
     LOGIN
     ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

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

      {/* =================================================
          BACKGROUND DECORATION
          ================================================= */}

      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-grid" />


      {/* =================================================
          BRAND PANEL
          ================================================= */}

      <aside className="auth-brand-panel">

        <div className="auth-brand">

          <div className="brand-icon">
            💼
          </div>

          <span>
            Hire<span>Sphere</span>
          </span>

        </div>


        <div className="brand-content">

          <div className="brand-badge">
            <span className="brand-badge-dot" />
            YOUR CAREER. YOUR FUTURE.
          </div>


          <h2>
            Find the work
            <br />
            <span>you love.</span>
          </h2>


          <p>
            Discover opportunities, connect with
            employers, and build a career that
            moves with you.
          </p>


          {/* =================================================
              FEATURES
              ================================================= */}

          <div className="brand-features">

            <div className="brand-feature">

              <span className="feature-icon">
                ✓
              </span>

              <div>
                <strong>
                  Smart job discovery
                </strong>

                <span>
                  Find roles that match your skills.
                </span>
              </div>

            </div>


            <div className="brand-feature">

              <span className="feature-icon">
                ✦
              </span>

              <div>
                <strong>
                  AI-powered career tools
                </strong>

                <span>
                  Optimize your resume with AI.
                </span>
              </div>

            </div>


            <div className="brand-feature">

              <span className="feature-icon">
                ◈
              </span>

              <div>
                <strong>
                  Connect with employers
                </strong>

                <span>
                  Take your next career step.
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              AI MINI CARD
              ================================================= */}

          <div className="brand-ai-card">

            <div className="brand-ai-icon">
              ✦
            </div>

            <div>

              <span className="brand-ai-label">
                HIRESPHERE AI
              </span>

              <p>
                Your AI-powered career assistant
              </p>

            </div>

            <span className="brand-ai-arrow">
              →
            </span>

          </div>

        </div>


        {/* BRAND FOOTER */}

        <div className="brand-footer">
          <span>
            © 2026 HireSphere
          </span>

          <span className="footer-separator">
            •
          </span>

          <span>
            Career intelligence platform
          </span>
        </div>

      </aside>


      {/* =================================================
          FORM PANEL
          ================================================= */}

      <main className="auth-form-panel">

        <div className="auth-card">

          {/* =================================================
              MOBILE BRAND
              ================================================= */}

          <div className="mobile-brand">

            <div className="brand-icon">
              💼
            </div>

            <span>
              Hire<span>Sphere</span>
            </span>

          </div>


          {/* =================================================
              HEADING
              ================================================= */}

          <div className="auth-heading">

            <div className="auth-eyebrow">
              <span>✦</span>
              WELCOME BACK
            </div>

            <h1>
              Sign in to your
              <span> account.</span>
            </h1>

            <p>
              Continue your journey with
              HireSphere and discover what's next.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
              ================================================= */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="auth-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  @
                </span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-group">

              <div className="password-label-row">

                <label htmlFor="login-password">
                  Password
                </label>

                <span className="secure-label">
                  <span>●</span>
                  Secure login
                </span>

              </div>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  ••
                </span>

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div
                className="auth-message auth-error"
                role="alert"
              >
                <span className="message-icon">
                  !
                </span>

                <span>
                  {error}
                </span>
              </div>
            )}


            {/* LOGIN BUTTON */}

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
                  <span>
                    Sign In
                  </span>

                  <span className="button-arrow">
                    →
                  </span>
                </>
              )}

            </button>


            {/* DIVIDER */}

            <div className="auth-divider">
              <span />
              <b>OR</b>
              <span />
            </div>


            {/* REGISTER */}

            <Link
              to="/register"
              className="secondary-auth-button"
            >
              <span>
                Create a new account
              </span>

              <span>
                →
              </span>
            </Link>


            {/* BOTTOM TEXT */}

            <p className="auth-bottom-text">
              By continuing, you agree to HireSphere's
              <span> terms</span> and
              <span> privacy policy</span>.
            </p>

          </form>


          {/* =================================================
              TRUST FOOTER
              ================================================= */}

          <div className="auth-trust">

            <span>
              🔒
            </span>

            <span>
              Your account is protected with secure
              authentication
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;