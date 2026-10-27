import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Briefcase,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  FileText,
  Layers,
  Compass,
  AlertTriangle,
  Flame,
} from "lucide-react";
import api from "../services/api";
import "../css/JobSeekerDashboard.css";

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET USER NAME
  // ==========================================

  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const userName = user?.name || "Job Seeker";

  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my/");
        console.log("Dashboard Applications:", response.data);

        setApplications(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => application.status === "PENDING"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "SHORTLISTED"
  ).length;

  const hiredApplications = applications.filter(
    (application) => application.status === "HIRED"
  ).length;

  // ==========================================
  // RECENT APPLICATIONS
  // ==========================================

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.applied_at) - new Date(a.applied_at)
    )
    .slice(0, 5);

  // ==========================================
  // STATUS HELPERS
  // ==========================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Under Review";
      case "SHORTLISTED":
        return "Shortlisted";
      case "HIRED":
        return "Hired";
      case "REJECTED":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="status-mini-icon" />;
      case "SHORTLISTED":
        return <Star className="status-mini-icon" />;
      case "HIRED":
        return <CheckCircle2 className="status-mini-icon" />;
      case "REJECTED":
        return <XCircle className="status-mini-icon" />;
      default:
        return <Clock className="status-mini-icon" />;
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="seeker-dashboard">
        <div className="dashboard-background-grid"></div>
        <div className="dashboard-orb dashboard-orb-one"></div>
        <div className="dashboard-orb dashboard-orb-two"></div>

        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <span className="loading-label">HIRESPHERE AI</span>
          <h2>Preparing your dashboard</h2>
          <p>Loading your career activity and latest application updates...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="seeker-dashboard">
        <div className="dashboard-background-grid"></div>
        <div className="dashboard-orb dashboard-orb-one"></div>
        <div className="dashboard-orb dashboard-orb-two"></div>

        <div className="dashboard-error">
          <div className="error-icon">
            <AlertTriangle className="error-icon-svg" />
          </div>
          <span className="error-label">SOMETHING WENT WRONG</span>
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <Link to="/jobs" className="dashboard-primary-btn">
            <Search className="btn-icon" />
            <span>Browse Jobs</span>
            <ArrowRight className="btn-arrow" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="seeker-dashboard">
      {/* BACKGROUND DECORATIONS */}
      <div className="dashboard-background-grid"></div>
      <div className="dashboard-orb dashboard-orb-one"></div>
      <div className="dashboard-orb dashboard-orb-two"></div>
      <div className="dashboard-orb dashboard-orb-three"></div>

      <div className="dashboard-content">
        {/* ======================================
            HERO / WELCOME
        ====================================== */}
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <div className="dashboard-eyebrow">
              <span className="eyebrow-dot"></span>
              JOB SEEKER WORKSPACE
              <span className="eyebrow-ai">AI POWERED</span>
            </div>

            <h1>
              Welcome back,
              <br />
              <span className="gradient-text">{userName}</span>
            </h1>

            <p>
              Track your applications, discover matched opportunities, and accelerate your tech career with AI-guided insights.
            </p>

            <div className="welcome-actions">
              <Link to="/jobs" className="dashboard-primary-btn">
                <Search className="btn-icon" />
                <span>Explore Jobs</span>
                <ArrowRight className="btn-arrow" />
              </Link>

              <Link to="/resume-analyzer" className="dashboard-secondary-btn">
                <Sparkles className="btn-icon spark-icon" />
                <span>AI Resume Analyzer</span>
              </Link>
            </div>
          </div>

          {/* HERO VISUAL METRIC BADGE */}
          <div className="welcome-visual">
            <div className="visual-glow"></div>
            <div className="career-orbit orbit-one"></div>
            <div className="career-orbit orbit-two"></div>

            <div className="career-core">
              <div className="core-icon">
                <Sparkles className="core-sparkle" />
              </div>
              <span>CAREER</span>
              <strong>READY</strong>
            </div>

            <div className="floating-card floating-card-top">
              <Sparkles className="floating-icon" />
              <div>
                <strong>AI Match</strong>
                <small>Skills-matched roles</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <Flame className="floating-icon flame-icon" />
              <div>
                <strong>Keep growing</strong>
                <small>High match potential</small>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            STATISTICS
        ====================================== */}
        <section className="dashboard-stats">
          {/* TOTAL */}
          <div className="stat-card stat-total">
            <div className="stat-card-top">
              <div className="stat-icon-wrap">
                <Layers className="stat-icon-svg" />
              </div>
              <span className="stat-trend">ALL TIME</span>
            </div>
            <div className="stat-content">
              <span>Total Applications</span>
              <strong>{totalApplications}</strong>
              <small>Applications submitted</small>
            </div>
          </div>

          {/* PENDING */}
          <div className="stat-card stat-pending">
            <div className="stat-card-top">
              <div className="stat-icon-wrap">
                <Clock className="stat-icon-svg" />
              </div>
              <span className="stat-trend">ACTIVE</span>
            </div>
            <div className="stat-content">
              <span>Under Review</span>
              <strong>{pendingApplications}</strong>
              <small>Awaiting response</small>
            </div>
          </div>

          {/* SHORTLISTED */}
          <div className="stat-card stat-shortlisted">
            <div className="stat-card-top">
              <div className="stat-icon-wrap">
                <Star className="stat-icon-svg" />
              </div>
              <span className="stat-trend">PROGRESS</span>
            </div>
            <div className="stat-content">
              <span>Shortlisted</span>
              <strong>{shortlistedApplications}</strong>
              <small>Moving forward</small>
            </div>
          </div>

          {/* HIRED */}
          <div className="stat-card stat-hired">
            <div className="stat-card-top">
              <div className="stat-icon-wrap">
                <CheckCircle2 className="stat-icon-svg" />
              </div>
              <span className="stat-trend">SUCCESS</span>
            </div>
            <div className="stat-content">
              <span>Offers & Hired</span>
              <strong>{hiredApplications}</strong>
              <small>Offers received</small>
            </div>
          </div>
        </section>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR TOOLKIT</span>
              <h2>Quick Actions</h2>
              <p>Everything you need to navigate and advance your job search.</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/jobs" className="quick-action-card">
              <div className="quick-card-icon">
                <Search className="quick-svg" />
              </div>
              <div className="quick-card-content">
                <span className="quick-card-number">01</span>
                <h3>Find Jobs</h3>
                <p>Search opportunities matching your technical skills.</p>
              </div>
              <ExternalLink className="action-arrow-svg" />
            </Link>

            <Link to="/applications" className="quick-action-card">
              <div className="quick-card-icon">
                <Briefcase className="quick-svg" />
              </div>
              <div className="quick-card-content">
                <span className="quick-card-number">02</span>
                <h3>My Applications</h3>
                <p>Track status and updates for every applied role.</p>
              </div>
              <ExternalLink className="action-arrow-svg" />
            </Link>

            <Link to="/resume-analyzer" className="quick-action-card">
              <div className="quick-card-icon">
                <Sparkles className="quick-svg" />
              </div>
              <div className="quick-card-content">
                <span className="quick-card-number">03</span>
                <h3>AI Resume Analyzer</h3>
                <p>Score your ATS compatibility and discover skill gaps.</p>
              </div>
              <ExternalLink className="action-arrow-svg" />
            </Link>

            <Link to="/job-matches" className="quick-action-card">
              <div className="quick-card-icon">
                <Compass className="quick-svg" />
              </div>
              <div className="quick-card-content">
                <span className="quick-card-number">04</span>
                <h3>AI Job Matches</h3>
                <p>Discover personalized roles ranked by your resume.</p>
              </div>
              <ExternalLink className="action-arrow-svg" />
            </Link>
          </div>
        </section>

        {/* ======================================
            RECENT APPLICATIONS
        ====================================== */}
        <section className="dashboard-section applications-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">APPLICATION ACTIVITY</span>
              <h2>Recent Applications</h2>
              <p>Your latest application submissions and status updates.</p>
            </div>

            {applications.length > 0 && (
              <Link to="/applications" className="view-all-link">
                View all
                <ArrowRight className="link-arrow" />
              </Link>
            )}
          </div>

          {recentApplications.length === 0 ? (
            <div className="empty-dashboard">
              <div className="empty-visual">
                <FileText className="empty-icon-svg" />
              </div>
              <span className="empty-kicker">READY WHEN YOU ARE</span>
              <h3>No applications yet</h3>
              <p>
                Your career journey begins with your first application. Explore verified tech roles and make your move.
              </p>
              <Link to="/jobs" className="dashboard-primary-btn">
                <Search className="btn-icon" />
                <span>Explore Jobs</span>
                <ArrowRight className="btn-arrow" />
              </Link>
            </div>
          ) : (
            <div className="recent-applications">
              {recentApplications.map((application, index) => (
                <div className="recent-application-card" key={application.id}>
                  <div className="application-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="application-job-icon">
                    <Briefcase className="job-briefcase-svg" />
                  </div>

                  <div className="application-info">
                    <h3>{application.job_title}</h3>
                    <p>{application.company_name}</p>
                    <span className="application-date">
                      Applied{" "}
                      {application.applied_at
                        ? new Date(application.applied_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>

                  <div className="application-right">
                    <span
                      className={`dashboard-status status-${application.status?.toLowerCase()}`}
                    >
                      {renderStatusIcon(application.status)}
                      <span>{getStatusLabel(application.status)}</span>
                    </span>

                    <Link
                      to={`/jobs/${application.job}`}
                      className="view-job-link"
                    >
                      <span>View Job</span>
                      <ExternalLink className="link-icon" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ======================================
            CAREER TIP BANNER
        ====================================== */}
        <section className="career-tip">
          <div className="career-tip-glow"></div>
          <div className="career-tip-icon">
            <Sparkles className="tip-sparkle" />
          </div>

          <div className="career-tip-content">
            <span className="tip-label">HIRESPHERE INSIGHT</span>
            <h3>Boost your interview rate</h3>
            <p>
              Tailor your resume skills to match job descriptions before applying. Our AI Resume Analyzer can highlight gaps and give you actionable fixes in seconds.
            </p>
          </div>

          <Link to="/resume-analyzer" className="tip-link">
            <span>Optimize Resume</span>
            <ArrowRight className="tip-arrow" />
          </Link>
        </section>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;