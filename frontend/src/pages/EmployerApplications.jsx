
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
        "/applications/employer"
      );

      console.log(
        "Employer Applications:",
        response.data
      );

      setApplications(response.data);

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
        `/applications/${applicationId}/status`,
        {},
        {
          params: {
            status: status
          }
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
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="applications-page">

        <div className="applications-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading Applications
          </h2>

          <p>
            Please wait while we fetch applications.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="applications-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="applications-header">

        <div>

          <span className="applications-eyebrow">
            EMPLOYER PANEL
          </span>

          <h1>
            Job Applications
          </h1>

          <p>
            Review and manage applications
            submitted for your jobs.
          </p>

        </div>


        <div className="application-count">

          <span>
            Total Applications
          </span>

          <strong>
            {applications.length}
          </strong>

        </div>

      </div>


      {/* =====================================
          MESSAGE
      ===================================== */}

      {message && (

        <div className="application-message">

          <span>
            ✓
          </span>

          {message}

        </div>

      )}


      {/* =====================================
          NO APPLICATIONS
      ===================================== */}

      {applications.length === 0 ? (

        <div className="no-applications">

          <div className="empty-icon">
            📄
          </div>

          <h2>
            No Applications Yet
          </h2>

          <p>
            You haven't received any applications
            for your jobs yet.
          </p>

        </div>

      ) : (


        /* ===================================
           APPLICATION LIST
        =================================== */

        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application.id}
            >


              {/* =================================
                  CARD HEADER
              ================================= */}

              <div className="application-card-header">

                <div className="job-info">

                  <div className="job-icon">
                    💼
                  </div>

                  <div>

                    <h2>
                      {application.jobTitle}
                    </h2>

                    <p>
                      {application.companyName}
                    </p>

                  </div>

                </div>


                <span
                  className={`status status-${application.status?.toLowerCase()}`}
                >
                  {application.status}
                </span>

              </div>


              {/* =================================
                  APPLICANT
              ================================= */}

              <div className="applicant-section">

                <div className="applicant-avatar">

                  {application.applicantName
                    ? application.applicantName
                        .charAt(0)
                        .toUpperCase()
                    : "A"}

                </div>


                <div className="applicant-details">

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
                    📅
                  </div>

                  <div>

                    <small>
                      Applied On
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
                              year: "numeric"
                            }
                          )
                        : "N/A"}

                    </strong>

                  </div>

                </div>


                <div className="meta-item">

                  <div className="meta-icon">
                    ✉️
                  </div>

                  <div>

                    <small>
                      Applicant Email
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
                    Current Status
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

                  {application.status === "PENDING" && (

                    <>

                      <button
                        className="shortlist-btn"
                        disabled={
                          updatingId === application.id
                        }
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "SHORTLISTED"
                          )
                        }
                      >

                        {updatingId === application.id
                          ? "Updating..."
                          : "Shortlist"}

                      </button>


                      <button
                        className="reject-btn"
                        disabled={
                          updatingId === application.id
                        }
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "REJECTED"
                          )
                        }
                      >
                        Reject
                      </button>

                    </>

                  )}


                  {/* SHORTLISTED */}

                  {application.status === "SHORTLISTED" && (

                    <>

                      <button
                        className="hire-btn"
                        disabled={
                          updatingId === application.id
                        }
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "HIRED"
                          )
                        }
                      >

                        {updatingId === application.id
                          ? "Updating..."
                          : "Hire"}

                      </button>


                      <button
                        className="reject-btn"
                        disabled={
                          updatingId === application.id
                        }
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "REJECTED"
                          )
                        }
                      >
                        Reject
                      </button>

                    </>

                  )}


                  {/* REJECTED */}

                  {application.status === "REJECTED" && (

                    <span className="status status-rejected">
                      Application Rejected
                    </span>

                  )}


                  {/* HIRED */}

                  {application.status === "HIRED" && (

                    <span className="status status-hired">
                      Candidate Hired
                    </span>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default EmployerApplications;

