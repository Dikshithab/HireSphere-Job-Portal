import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Sparkles,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Building2,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  Layers,
  Inbox,
  Check
} from "lucide-react";
import api from "../services/api";
import "../css/MyApplication.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/applications/my/");
        console.log("My Applications Response:", response.data);

        const applicationData = Array.isArray(response.data)
          ? response.data
          : response.data.applications || [];

        const formattedApplications = applicationData.map((application) => ({
          ...application,
          jobId: application.job,
          jobTitle: application.job_title,
          companyName: application.company_name,
          appliedAt: application.applied_at,
        }));

        setApplications(formattedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(
          error.response?.data?.message ||
          "Unable to load applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={14} />;
      case "SHORTLISTED":
        return <Sparkles size={14} />;
      case "REJECTED":
        return <XCircle size={14} />;
      case "HIRED":
        return <CheckCircle2 size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Under Review";
      case "SHORTLISTED":
        return "Shortlisted";
      case "REJECTED":
        return "Not Selected";
      case "HIRED":
        return "Hired";
      default:
        return status || "Unknown";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "PENDING":
        return "Your application is currently under review by the hiring team.";
      case "SHORTLISTED":
        return "Great news! Your profile was shortlisted for the next interview round.";
      case "REJECTED":
        return "This application was not selected at this time.";
      case "HIRED":
        return "Congratulations! An offer was extended or finalized.";
      default:
        return "Application status updated.";
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalApplications = applications.length;
  const pendingCount = applications.filter((app) => app.status === "PENDING").length;
  const shortlistedCount = applications.filter((app) => app.status === "SHORTLISTED").length;
  const rejectedCount = applications.filter((app) => app.status === "REJECTED").length;
  const hiredCount = applications.filter((app) => app.status === "HIRED").length;

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-bg-grid"></div>
        <div className="applications-orb applications-orb-one"></div>
        <div className="applications-orb applications-orb-two"></div>

        <div className="applications-loading">
          <div className="applications-loading-ring">
            <Sparkles size={24} className="ring-sparkle" />
          </div>
          <span className="loading-label">HIRESPHERE WORKSPACE</span>
          <h2>Loading your applications</h2>
          <p>Preparing your application tracking workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="applications-bg-grid"></div>
        <div className="applications-orb applications-orb-one"></div>
        <div className="applications-orb applications-orb-two"></div>

        <div className="applications-error-state">
          <div className="error-state-icon">
            <AlertTriangle size={24} />
          </div>
          <span className="error-label">APPLICATIONS UNAVAILABLE</span>
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <Link to="/jobs" className="browse-jobs-btn">
            <span>Browse Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      {/* Background Atmosphere */}
      <div className="applications-bg-grid"></div>
      <div className="applications-orb applications-orb-one"></div>
      <div className="applications-orb applications-orb-two"></div>
      <div className="applications-orb applications-orb-three"></div>

      <div className="applications-container">
        {/* HEADER */}
        <header className="applications-header">
          <div className="applications-header-content">
            <div className="applications-eyebrow">
              <span className="eyebrow-dot"></span>
              APPLICATION TRACKER
              <span className="ai-badge">LIVE STATUS</span>
            </div>

            <h1>
              My <span className="gradient-text">Applications.</span>
            </h1>

            <p>
              Monitor every active job application, interview pipeline status, and hiring decision in one clean view.
            </p>
          </div>

          <Link to="/jobs" className="browse-jobs-btn header-browse-btn">
            <Search size={15} />
            <span>Find More Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </header>

        {/* STATISTICS STRIP */}
        {applications.length > 0 && (
          <section className="application-stats">
            <div className="application-stat-card">
              <div className="application-stat-icon total">
                <Layers size={16} />
              </div>
              <div>
                <span>Total Applied</span>
                <strong>{totalApplications}</strong>
              </div>
            </div>

            <div className="application-stat-card">
              <div className="application-stat-icon pending">
                <Clock size={16} />
              </div>
              <div>
                <span>Under Review</span>
                <strong>{pendingCount}</strong>
              </div>
            </div>

            <div className="application-stat-card">
              <div className="application-stat-icon shortlisted">
                <Sparkles size={16} />
              </div>
              <div>
                <span>Shortlisted</span>
                <strong>{shortlistedCount}</strong>
              </div>
            </div>

            <div className="application-stat-card">
              <div className="application-stat-icon rejected">
                <XCircle size={16} />
              </div>
              <div>
                <span>Not Selected</span>
                <strong>{rejectedCount}</strong>
              </div>
            </div>

            <div className="application-stat-card">
              <div className="application-stat-icon hired">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span>Offers / Hired</span>
                <strong>{hiredCount}</strong>
              </div>
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <section className="no-applications">
            <div className="empty-glow"></div>
            <div className="empty-application-icon">
              <Inbox size={32} />
            </div>

            <span className="empty-label">APPLICATION WORKSPACE</span>
            <h2>No active applications</h2>
            <p>
              You haven't submitted any job applications yet. Explore openings tailored to your skillset and apply directly.
            </p>

            <Link to="/jobs" className="browse-jobs-btn empty-browse-btn">
              <Search size={15} />
              <span>Browse Open Positions</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        ) : (
          /* APPLICATION LIST */
          <section className="applications-section">
            <div className="applications-section-header">
              <div>
                <span className="section-kicker">APPLICATION ACTIVITY</span>
                <h2>Active Submissions</h2>
              </div>

              <span className="application-count">
                {totalApplications} {totalApplications === 1 ? "application" : "applications"}
              </span>
            </div>

            <div className="applications-list">
              {applications.map((application, index) => (
                <article className="application-card" key={application.id}>
                  <div className="application-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="application-job-icon">
                    <Briefcase size={18} />
                  </div>

                  <div className="application-main">
                    <h2>{application.jobTitle}</h2>

                    <h3>
                      <Building2 size={14} />
                      <span>{application.companyName}</span>
                    </h3>

                    <div className="application-meta">
                      <span>
                        <MapPin size={12} />
                        {application.location || "Remote / Hybrid"}
                      </span>

                      <span>
                        <Clock size={12} />
                        Applied {formatDate(application.appliedAt)}
                      </span>

                      {application.job_type && (
                        <span>
                          <Briefcase size={12} />
                          {application.job_type}
                        </span>
                      )}
                    </div>

                    {application.timeline && application.timeline.length > 0 && (
                      <div className="application-timeline">
                        <div className="timeline-title">PIPELINE MILESTONES</div>
                        <div className="timeline">
                          {application.timeline.map((event, timelineIndex) => (
                            <div
                              className={`timeline-item ${event.completed ? "completed" : ""}`}
                              key={`${application.id}-${event.status}-${timelineIndex}`}
                            >
                              <div className="timeline-marker">
                                {event.completed ? <Check size={10} /> : null}
                              </div>
                              <div className="timeline-content">
                                <strong>{event.label}</strong>
                                {event.date && <span>{formatDate(event.date)}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="application-status">
                    <div className={`status status-${application.status?.toLowerCase()}`}>
                      <span className="status-icon">
                        {getStatusIcon(application.status)}
                      </span>
                      <span>{getStatusText(application.status)}</span>
                    </div>

                    <p>{getStatusMessage(application.status)}</p>

                    <Link to={`/jobs/${application.jobId}`} className="view-application-btn">
                      <span>View Job Details</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        {applications.length > 0 && (
          <section className="applications-cta">
            <div className="cta-glow"></div>
            <div className="cta-icon">
              <Sparkles size={22} />
            </div>

            <div className="cta-content">
              <span>EXPLORE MORE ROLES</span>
              <h3>Looking to expand your opportunities?</h3>
              <p>Browse newly posted openings and find additional roles aligned with your career trajectory.</p>
            </div>

            <Link to="/jobs" className="cta-jobs-btn">
              <span>Discover Roles</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default MyApplications;
