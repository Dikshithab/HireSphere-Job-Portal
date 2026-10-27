import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Briefcase,
  Users,
  Clock,
  Star,
  CheckCircle2,
  Building,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Percent,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import "../css/EmployerDashboard.css";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsResponse, applicationsResponse] =
          await Promise.all([
            api.get("/jobs/"),
            api.get("/applications/employer/"),
          ]);

        console.log("Employer Jobs:", jobsResponse.data);
        console.log("Employer Applications:", applicationsResponse.data);

        setJobs(
          Array.isArray(jobsResponse.data) ? jobsResponse.data : []
        );

        setApplications(
          Array.isArray(applicationsResponse.data)
            ? applicationsResponse.data
            : []
        );
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;
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

  const hiringRate =
    totalApplications > 0
      ? Math.round((hiredApplications / totalApplications) * 100)
      : 0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="employer-dashboard">
        <div className="dashboard-bg-orb dashboard-orb-one" />
        <div className="dashboard-bg-orb dashboard-orb-two" />
        <div className="dashboard-bg-grid" />

        <div className="dashboard-loading">
          <div className="dashboard-spinner" />
          <span className="loading-label">EMPLOYER WORKSPACE</span>
          <h2>Loading your workspace</h2>
          <p>Fetching your jobs, candidates, and talent pipeline...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="employer-dashboard">
        <div className="dashboard-bg-orb dashboard-orb-one" />
        <div className="dashboard-bg-orb dashboard-orb-two" />
        <div className="dashboard-bg-grid" />

        <div className="dashboard-error">
          <div className="error-icon">
            <AlertCircle className="error-icon-svg" />
          </div>
          <span className="error-eyebrow">WORKSPACE ERROR</span>
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button
            className="dashboard-retry-btn"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="retry-icon" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="employer-dashboard">
      {/* BACKGROUND */}
      <div className="dashboard-bg-orb dashboard-orb-one" />
      <div className="dashboard-bg-orb dashboard-orb-two" />
      <div className="dashboard-bg-orb dashboard-orb-three" />
      <div className="dashboard-bg-grid" />

      <div className="dashboard-container">
        {/* =====================================
            HEADER
        ===================================== */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-eyebrow">
              <span className="eyebrow-dot" />
              EMPLOYER WORKSPACE
            </div>

            <h1>
              Manage your{" "}
              <span className="gradient-text">talent pipeline.</span>
            </h1>

            <p>
              Manage your job postings, review incoming candidates, and build high-performing teams from one intelligent workspace.
            </p>
          </div>

          <Link to="/create-job" className="dashboard-post-btn">
            <Plus className="post-btn-icon" />
            <span>Post New Job</span>
            <ArrowRight className="post-btn-arrow" />
          </Link>
        </header>

        {/* =====================================
            TOP STATUS STRIP
        ===================================== */}
        <div className="dashboard-status-strip">
          <div className="status-strip-icon">
            <Sparkles className="strip-sparkle" />
          </div>

          <div className="status-strip-content">
            <strong>Your recruitment workspace is active</strong>
            <span>
              {activeJobs} active {activeJobs === 1 ? "position" : "positions"}{" "}
              currently visible to candidates.
            </span>
          </div>

          <div className="status-strip-live">
            <span className="live-dot-pulse" />
            LIVE
          </div>
        </div>

        {/* =====================================
            MAIN STATISTICS
        ===================================== */}
        <section className="dashboard-stats">
          {/* TOTAL JOBS */}
          <div className="stat-card stat-blue">
            <div className="stat-card-top">
              <div className="stat-icon">
                <Briefcase className="stat-svg" />
              </div>
              <span className="stat-trend">ROLES</span>
            </div>
            <div className="stat-content">
              <span>Total Jobs</span>
              <strong>{totalJobs}</strong>
              <small>Positions posted</small>
            </div>
          </div>

          {/* ACTIVE JOBS */}
          <div className="stat-card stat-green">
            <div className="stat-card-top">
              <div className="stat-icon">
                <CheckCircle2 className="stat-svg" />
              </div>
              <span className="stat-live-dot">● ACTIVE</span>
            </div>
            <div className="stat-content">
              <span>Active Openings</span>
              <strong>{activeJobs}</strong>
              <small>Accepting applications</small>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="stat-card stat-purple">
            <div className="stat-card-top">
              <div className="stat-icon">
                <Users className="stat-svg" />
              </div>
              <span className="stat-trend">CANDIDATES</span>
            </div>
            <div className="stat-content">
              <span>Total Applicants</span>
              <strong>{totalApplications}</strong>
              <small>Profiles received</small>
            </div>
          </div>

          {/* PENDING */}
          <div className="stat-card stat-orange">
            <div className="stat-card-top">
              <div className="stat-icon">
                <Clock className="stat-svg" />
              </div>
              {pendingApplications > 0 && (
                <span className="pending-badge">
                  {pendingApplications} new
                </span>
              )}
            </div>
            <div className="stat-content">
              <span>Pending Review</span>
              <strong>{pendingApplications}</strong>
              <small>Awaiting evaluation</small>
            </div>
          </div>
        </section>

        {/* =====================================
            SECONDARY STATS STRIP
        ===================================== */}
        <section className="secondary-stats">
          <div className="secondary-stat">
            <div className="secondary-stat-icon shortlisted">
              <Star className="sec-icon-svg" />
            </div>
            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedApplications}</strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat">
            <div className="secondary-stat-icon hired">
              <CheckCircle2 className="sec-icon-svg" />
            </div>
            <div>
              <span>Hired Candidates</span>
              <strong>{hiredApplications}</strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat">
            <div className="secondary-stat-icon conversion">
              <Percent className="sec-icon-svg" />
            </div>
            <div>
              <span>Hiring Conversion</span>
              <strong>{hiringRate}%</strong>
            </div>
          </div>

          <div className="secondary-divider" />

          <div className="secondary-stat secondary-stat-insight">
            <div className="insight-icon">
              <Sparkles className="sec-icon-svg" />
            </div>
            <div>
              <span>Recruiter AI</span>
              <strong>Ready</strong>
            </div>
          </div>
        </section>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">WORKFLOW</span>
              <h2>Manage your recruitment</h2>
              <p>Everything you need to accelerate your candidate hiring process.</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/create-job" className="quick-action-card quick-blue">
              <div className="quick-action-icon">
                <Plus className="qa-icon" />
              </div>
              <div className="quick-action-content">
                <span className="quick-action-number">01</span>
                <h3>Post a Job</h3>
                <p>Create a new opening and start receiving talent matches.</p>
              </div>
              <ArrowRight className="action-arrow" />
            </Link>

            <Link to="/employer/jobs" className="quick-action-card quick-purple">
              <div className="quick-action-icon">
                <Briefcase className="qa-icon" />
              </div>
              <div className="quick-action-content">
                <span className="quick-action-number">02</span>
                <h3>Manage Jobs</h3>
                <p>Review, edit, and update statuses on your active postings.</p>
              </div>
              <ArrowRight className="action-arrow" />
            </Link>

            <Link to="/employer/applications" className="quick-action-card quick-green">
              <div className="quick-action-icon">
                <Users className="qa-icon" />
              </div>
              <div className="quick-action-content">
                <span className="quick-action-number">03</span>
                <h3>Applications</h3>
                <p>Review candidate resumes, shortlist, and hire talent.</p>
              </div>
              <ArrowRight className="action-arrow" />
            </Link>

            <Link to="/company" className="quick-action-card quick-orange">
              <div className="quick-action-icon">
                <Building className="qa-icon" />
              </div>
              <div className="quick-action-content">
                <span className="quick-action-number">04</span>
                <h3>Company Profile</h3>
                <p>Keep your organization brand and company details updated.</p>
              </div>
              <ArrowRight className="action-arrow" />
            </Link>
          </div>
        </section>

        {/* =====================================
            RECENT DATA (GRID)
        ===================================== */}
        <div className="dashboard-grid">
          {/* RECENT JOBS */}
          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">JOB POSTINGS</span>
                <h2>Recent Jobs</h2>
              </div>
              <Link to="/employer/jobs" className="view-all">
                <span>View All</span>
                <ArrowRight className="panel-arrow" />
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="panel-empty">
                <div className="empty-panel-icon">
                  <Briefcase className="empty-panel-svg" />
                </div>
                <h3>No jobs posted yet</h3>
                <p>Start building your talent pipeline by publishing your first job.</p>
                <Link to="/create-job" className="empty-action">
                  <Plus className="btn-icon" />
                  <span>Post a Job</span>
                </Link>
              </div>
            ) : (
              <div className="recent-list">
                {jobs.slice(0, 5).map((job) => (
                  <div className="recent-job" key={job.id}>
                    <div className="recent-job-icon">
                      <Briefcase className="job-svg" />
                    </div>

                    <div className="recent-job-info">
                      <h3>{job.title}</h3>
                      <p>{job.location || "Location not specified"}</p>
                    </div>

                    <div className="recent-job-meta">
                      <span
                        className={
                          job.status === "ACTIVE"
                            ? "job-status active"
                            : "job-status closed"
                        }
                      >
                        <span className="status-dot" />
                        {job.status === "ACTIVE" ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RECENT APPLICATIONS */}
          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">CANDIDATES</span>
                <h2>Recent Applications</h2>
              </div>
              <Link to="/employer/applications" className="view-all">
                <span>View All</span>
                <ArrowRight className="panel-arrow" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="panel-empty">
                <div className="empty-panel-icon">
                  <Users className="empty-panel-svg" />
                </div>
                <h3>No applications yet</h3>
                <p>New candidate submissions will appear here automatically.</p>
              </div>
            ) : (
              <div className="recent-list">
                {applications.slice(0, 5).map((application) => {
                  const applicantName =
                    application.applicant_name ||
                    application.applicant?.name ||
                    "Applicant";

                  return (
                    <div className="recent-application" key={application.id}>
                      <div className="applicant-avatar">
                        {applicantName.charAt(0).toUpperCase()}
                      </div>

                      <div className="application-info">
                        <h3>{applicantName}</h3>
                        <p>{application.job_title || "Job Application"}</p>
                      </div>

                      <span
                        className={`status status-${application.status?.toLowerCase()}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* =====================================
            FOOTER
        ===================================== */}
        <div className="dashboard-footer">
          <Sparkles className="footer-sparkle" />
          <span>HireSphere Employer Workspace</span>
          <span className="footer-dot">•</span>
          <span>Your intelligent talent acquisition platform</span>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;