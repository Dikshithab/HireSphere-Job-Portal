import { useEffect, useState } from "react";
import {
  Users,
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
  Mail,
  Calendar,
  AlertTriangle,
  Check,
  X,
  Clock,
  User
} from "lucide-react";
import api from "../services/api";
import "../css/MyApplication.css";

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications/employer/");
      console.log("Employer Applications:", response.data);

      const formattedApplications = response.data.map((application) => ({
        ...application,
        jobTitle: application.job_title,
        applicantName: application.applicant_name,
        applicantEmail: application.applicant_email,
        appliedAt: application.applied_at,
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Applications error:", error);
      setMessage(
        error.response?.data?.message || "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    setMessage("");

    try {
      await api.put(`/applications/${applicationId}/status/`, {
        status: status,
      });

      setMessage(
        `Application ${status.toLowerCase()} successfully!`
      );

      await fetchApplications();
    } catch (error) {
      console.error("Status update error:", error);
      setMessage(
        error.response?.data?.message || "Unable to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  const getApplicantInitial = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-bg-orb app-orb-one" />
        <div className="applications-bg-orb app-orb-two" />
        <div className="applications-bg-grid" />

        <div className="applications-container">
          <div className="applications-loading">
            <div className="applications-loading-icon">
              <Sparkles size={24} />
            </div>
            <div className="applications-loading-spinner" />
            <h2>Loading candidate pipeline</h2>
            <p>Fetching applicant profiles and interview statuses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-bg-orb app-orb-one" />
      <div className="applications-bg-orb app-orb-two" />
      <div className="applications-bg-orb app-orb-three" />
      <div className="applications-bg-grid" />

      <div className="applications-container">
        {/* HEADER */}
        <header className="applications-header">
          <div className="applications-header-main">
            <div className="applications-eyebrow">
              <span className="applications-eyebrow-dot" />
              EMPLOYER HIRING SUITE
            </div>

            <h1>
              Candidate <span>Pipeline.</span>
            </h1>

            <p>
              Review applicants, update hiring status, and streamline candidate qualification.
            </p>
          </div>

          <div className="application-count">
            <div className="application-count-icon">
              <Users size={18} />
            </div>
            <div className="application-count-content">
              <span>TOTAL APPLICANTS</span>
              <strong>{applications.length}</strong>
            </div>
          </div>
        </header>

        {/* INFO & PIPELINE STRIP */}
        <div className="applications-info-strip">
          <div className="applications-info-icon">
            <Sparkles size={18} />
          </div>

          <div className="applications-info-content">
            <strong>Candidate Management System</strong>
            <span>Progress candidates through review, shortlisting, and hiring with 1-click status updates.</span>
          </div>

          <div className="applications-info-stats">
            <div>
              <strong>
                {applications.filter((app) => app.status === "PENDING").length}
              </strong>
              <span>Pending</span>
            </div>

            <div>
              <strong>
                {applications.filter((app) => app.status === "SHORTLISTED").length}
              </strong>
              <span>Shortlisted</span>
            </div>

            <div>
              <strong>
                {applications.filter((app) => app.status === "HIRED").length}
              </strong>
              <span>Hired</span>
            </div>
          </div>
        </div>

        {/* STATUS MESSAGE BANNER */}
        {message && (
          <div
            className={`application-message ${
              message.includes("successfully")
                ? "message-success"
                : "message-error"
            }`}
            role="alert"
          >
            <span className="message-icon">
              {message.includes("successfully") ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
            </span>
            <span>{message}</span>
          </div>
        )}

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="no-applications">
            <div className="empty-icon">
              <Users size={32} />
            </div>

            <div className="empty-content">
              <span className="empty-kicker">CANDIDATE PIPELINE</span>
              <h2>No applications received yet</h2>
              <p>
                Applications for your active job listings will appear here as soon as candidates submit them.
              </p>
            </div>
          </div>
        ) : (
          /* CANDIDATE APPLICATIONS LIST */
          <div className="applications-list">
            {applications.map((application, index) => (
              <article className="application-card" key={application.id}>
                <div className="application-card-glow" />

                <div className="application-card-header">
                  <div className="job-info">
                    <div className="job-icon">
                      <Briefcase size={18} />
                    </div>

                    <div className="job-info-content">
                      <span className="application-number">
                        CANDIDATE #{String(index + 1).padStart(2, "0")}
                      </span>

                      <h2>{application.jobTitle}</h2>
                      <p>{application.companyName}</p>
                    </div>
                  </div>

                  <span className={`status status-${getStatusClass(application.status)}`}>
                    <span className="status-dot" />
                    {application.status}
                  </span>
                </div>

                <div className="applicant-section">
                  <div className="applicant-avatar">
                    {getApplicantInitial(application.applicantName)}
                  </div>

                  <div className="applicant-details">
                    <span>APPLICANT NAME</span>
                    <h3>{application.applicantName || "Applicant"}</h3>
                    <p>{application.applicantEmail}</p>
                  </div>
                </div>

                <div className="application-meta">
                  <div className="meta-item">
                    <div className="meta-icon">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <small>Applied On</small>
                      <strong>
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-icon">
                      <Mail size={14} />
                    </div>
                    <div>
                      <small>Contact Email</small>
                      <strong>{application.applicantEmail}</strong>
                    </div>
                  </div>
                </div>

                <div className="application-card-footer">
                  <div className="status-label">
                    <span>CURRENT STATUS</span>
                    <strong>{application.status}</strong>
                  </div>

                  {/* APPLICATION ACTIONS */}
                  <div className="application-actions">
                    {application.status === "PENDING" && (
                      <>
                        <button
                          className="shortlist-btn"
                          disabled={updatingId === application.id}
                          onClick={() => updateStatus(application.id, "SHORTLISTED")}
                        >
                          {updatingId === application.id ? (
                            <>
                              <span className="action-spinner" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              <span>Shortlist</span>
                            </>
                          )}
                        </button>

                        <button
                          className="reject-btn"
                          disabled={updatingId === application.id}
                          onClick={() => updateStatus(application.id, "REJECTED")}
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {application.status === "SHORTLISTED" && (
                      <>
                        <button
                          className="hire-btn"
                          disabled={updatingId === application.id}
                          onClick={() => updateStatus(application.id, "HIRED")}
                        >
                          {updatingId === application.id ? (
                            <>
                              <span className="action-spinner" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Hire Candidate</span>
                            </>
                          )}
                        </button>

                        <button
                          className="reject-btn"
                          disabled={updatingId === application.id}
                          onClick={() => updateStatus(application.id, "REJECTED")}
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {application.status === "REJECTED" && (
                      <span className="final-status rejected-final">
                        <XCircle size={14} />
                        <span>Candidate Not Selected</span>
                      </span>
                    )}

                    {application.status === "HIRED" && (
                      <span className="final-status hired-final">
                        <CheckCircle2 size={14} />
                        <span>Candidate Hired</span>
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="applications-footer">
          <Sparkles size={13} />
          <span>HireSphere Talent Cloud — Intelligent Recruiting Pipeline</span>
        </div>
      </div>
    </div>
  );
}

export default EmployerApplications;