import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/MyApplication.css";

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH EMPLOYER APPLICATIONS
  // ==========================================

  const fetchApplications = async () => {
    try {
      const response = await api.get(
        "/applications/employer/"
      );

      console.log(
        "Employer Applications:",
        response.data
      );

      const formattedApplications =
        response.data.map((application) => ({
          ...application,
          jobTitle: application.job_title,
          applicantName:
            application.applicant_name,
          applicantEmail:
            application.applicant_email,
          appliedAt: application.applied_at,
        }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error(
        "Applications error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    setUpdatingId(applicationId);
    setMessage("");

    try {
      await api.put(
        `/applications/${applicationId}/status/`,
        {
          status: status,
        }
      );

      setMessage(
        `Application ${status.toLowerCase()} successfully!`
      );

      await fetchApplications();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // GET STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return (
      status?.toLowerCase() || "pending"
    );
  };

  // ==========================================
  // GET INITIAL
  // ==========================================

  const getApplicantInitial = (name) => {
    if (!name) {
      return "A";
    }

    return name.charAt(0).toUpperCase();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applications-page">

        <div className="applications-bg-orb app-orb-one" />
        <div className="applications-bg-orb app-orb-two" />
        <div className="applications-bg-grid" />

        <div className="applications-container">

          <div className="applications-loading">

            <div className="applications-loading-icon">
              ✦
            </div>

            <div className="applications-loading-spinner" />

            <h2>
              Loading applications
            </h2>

            <p>
              Please wait while we fetch your
              candidate applications.
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="applications-page">

      {/* Background */}
      <div className="applications-bg-orb app-orb-one" />
      <div className="applications-bg-orb app-orb-two" />
      <div className="applications-bg-orb app-orb-three" />
      <div className="applications-bg-grid" />

      <div className="applications-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="applications-header">

          <div className="applications-header-main">

            <div className="applications-eyebrow">
              <span className="applications-eyebrow-dot" />
              EMPLOYER WORKSPACE
            </div>

            <h1>
              Find your next{" "}
              <span>great hire.</span>
            </h1>

            <p>
              Review candidates, manage applications
              and move the right people forward.
            </p>

          </div>

          <div className="application-count">

            <div className="application-count-icon">
              ◉
            </div>

            <div className="application-count-content">

              <span>
                TOTAL APPLICATIONS
              </span>

              <strong>
                {applications.length}
              </strong>

            </div>

          </div>

        </header>

        {/* =====================================
            INFO STRIP
        ====================================== */}

        <div className="applications-info-strip">

          <div className="applications-info-icon">
            ✦
          </div>

          <div className="applications-info-content">

            <strong>
              Your candidate pipeline
            </strong>

            <span>
              Review each application and update
              candidates as they move through your
              hiring process.
            </span>

          </div>

          <div className="applications-info-stats">

            <div>
              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status === "PENDING"
                  ).length
                }
              </strong>

              <span>Pending</span>
            </div>

            <div>
              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status ===
                      "SHORTLISTED"
                  ).length
                }
              </strong>

              <span>Shortlisted</span>
            </div>

            <div>
              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status === "HIRED"
                  ).length
                }
              </strong>

              <span>Hired</span>
            </div>

          </div>

        </div>

        {/* =====================================
            MESSAGE
        ====================================== */}

        {message && (
          <div
            className={`application-message ${
              message.includes(
                "successfully"
              )
                ? "message-success"
                : "message-error"
            }`}
            role="alert"
          >

            <span className="message-icon">
              {message.includes(
                "successfully"
              )
                ? "✓"
                : "!"}
            </span>

            <span>
              {message}
            </span>

          </div>
        )}

        {/* =====================================
            EMPTY STATE
        ====================================== */}

        {applications.length === 0 ? (

          <div className="no-applications">

            <div className="empty-icon">
              ◫
            </div>

            <div className="empty-content">

              <span className="empty-kicker">
                CANDIDATE PIPELINE
              </span>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't received any
                applications for your jobs yet.
                Once candidates apply, they'll
                appear here.
              </p>

            </div>

          </div>

        ) : (

          /* ===================================
             APPLICATION LIST
          ==================================== */

          <div className="applications-list">

            {applications.map(
              (application, index) => (

                <article
                  className="application-card"
                  key={application.id}
                >

                  {/* Card top accent */}
                  <div className="application-card-glow" />

                  {/* =================================
                      CARD HEADER
                  ================================= */}

                  <div className="application-card-header">

                    <div className="job-info">

                      <div className="job-icon">
                        💼
                      </div>

                      <div className="job-info-content">

                        <span className="application-number">
                          APPLICATION #
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h2>
                          {application.jobTitle}
                        </h2>

                        <p>
                          {application.companyName}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`status status-${getStatusClass(
                        application.status
                      )}`}
                    >
                      <span className="status-dot" />
                      {application.status}
                    </span>

                  </div>

                  {/* =================================
                      APPLICANT
                  ================================= */}

                  <div className="applicant-section">

                    <div className="applicant-avatar">
                      {getApplicantInitial(
                        application.applicantName
                      )}
                    </div>

                    <div className="applicant-details">

                      <span>
                        CANDIDATE
                      </span>

                      <h3>
                        {application.applicantName}
                      </h3>

                      <p>
                        {application.applicantEmail}
                      </p>

                    </div>

                  </div>

                  {/* =================================
                      META INFORMATION
                  ================================= */}

                  <div className="application-meta">

                    <div className="meta-item">

                      <div className="meta-icon">
                        ◷
                      </div>

                      <div>

                        <small>
                          Applied on
                        </small>

                        <strong>
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </strong>

                      </div>

                    </div>

                    <div className="meta-item">

                      <div className="meta-icon">
                        @
                      </div>

                      <div>

                        <small>
                          Applicant email
                        </small>

                        <strong>
                          {application.applicantEmail}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* =================================
                      CARD FOOTER
                  ================================= */}

                  <div className="application-card-footer">

                    <div className="status-label">

                      <span>
                        CURRENT STATUS
                      </span>

                      <strong>
                        {application.status}
                      </strong>

                    </div>

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="application-actions">

                      {/* PENDING */}

                      {application.status ===
                        "PENDING" && (
                        <>

                          <button
                            className="shortlist-btn"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "SHORTLISTED"
                              )
                            }
                          >
                            {updatingId ===
                            application.id ? (
                              <>
                                <span className="action-spinner" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                Shortlist
                              </>
                            )}
                          </button>

                          <button
                            className="reject-btn"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            <span>×</span>
                            Reject
                          </button>

                        </>
                      )}

                      {/* SHORTLISTED */}

                      {application.status ===
                        "SHORTLISTED" && (
                        <>

                          <button
                            className="hire-btn"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "HIRED"
                              )
                            }
                          >
                            {updatingId ===
                            application.id ? (
                              <>
                                <span className="action-spinner" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                Hire
                              </>
                            )}
                          </button>

                          <button
                            className="reject-btn"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            <span>×</span>
                            Reject
                          </button>

                        </>
                      )}

                      {/* REJECTED */}

                      {application.status ===
                        "REJECTED" && (
                        <span className="final-status rejected-final">
                          <span>×</span>
                          Application Rejected
                        </span>
                      )}

                      {/* HIRED */}

                      {application.status ===
                        "HIRED" && (
                        <span className="final-status hired-final">
                          <span>✓</span>
                          Candidate Hired
                        </span>
                      )}

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

        <div className="applications-footer">
          <span>✦</span>
          <span>
            Hire smarter. Build stronger teams.
          </span>
        </div>

      </div>

    </div>
  );
}

export default EmployerApplications;