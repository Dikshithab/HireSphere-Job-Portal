import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/JobDetails.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationMessage, setApplicationMessage] =
    useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const role = user?.role;

  // ==========================================
  // LOAD JOB DETAILS
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(
          `/jobs/${id}/`,
          {
            skipAuth: true,
          }
        );

        console.log(
          "Job Details:",
          response.data
        );

        setJob(response.data);
      } catch (error) {
        console.error(
          "Error fetching job:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // CHECK WHETHER ALREADY APPLIED
  // ==========================================

  useEffect(() => {
    const checkApplication = async () => {
      if (
        !token ||
        role !== "JOB_SEEKER"
      ) {
        return;
      }

      try {
        const response = await api.get(
          "/applications/my/"
        );

        const applications = response.data;

        const alreadyApplied =
          applications.some(
            (application) =>
              Number(application.job) ===
              Number(id)
          );

        if (alreadyApplied) {
          setApplied(true);

          setApplicationMessage(
            "You have already applied for this job."
          );
        }
      } catch (error) {
        console.error(
          "Error checking application:",
          error
        );
      }
    };

    checkApplication();
  }, [id, token, role]);

  // ==========================================
  // APPLY FOR JOB
  // ==========================================

  const handleApply = async () => {
    const currentToken =
      localStorage.getItem("token");

    const storedCurrentUser =
      localStorage.getItem("user");

    let currentUser = null;

    try {
      currentUser = storedCurrentUser
        ? JSON.parse(storedCurrentUser)
        : null;
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );
    }

    const currentRole =
      currentUser?.role;

    if (!currentToken) {
      setApplicationMessage(
        "Please login as a job seeker to apply."
      );

      return;
    }

    if (currentRole !== "JOB_SEEKER") {
      setApplicationMessage(
        "Only job seekers can apply for jobs."
      );

      return;
    }

    if (applied) {
      setApplicationMessage(
        "You have already applied for this job."
      );

      return;
    }

    setApplying(true);
    setApplicationMessage("");

    try {
      const response = await api.post(
        `/applications/jobs/${id}/apply/`
      );

      console.log(
        "Application submitted:",
        response.data
      );

      setApplied(true);

      setApplicationMessage(
        "Application submitted successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "Application Error:",
        error
      );

      if (error.response) {
        const backendMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          "Unable to submit application.";

        setApplicationMessage(
          typeof backendMessage === "string"
            ? backendMessage
            : "Unable to submit application."
        );

        if (
          typeof backendMessage ===
            "string" &&
          backendMessage
            .toLowerCase()
            .includes("already applied")
        ) {
          setApplied(true);
        }
      } else {
        setApplicationMessage(
          "Cannot connect to server."
        );
      }
    } finally {
      setApplying(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-bg-orb orb-one" />
        <div className="job-details-bg-orb orb-two" />
        <div className="job-details-bg-grid" />

        <div className="job-details-loading">
          <div className="loading-ai-icon">
            ✦
          </div>

          <div className="job-loading-spinner" />

          <h2>
            Loading opportunity
          </h2>

          <p>
            Fetching the latest job details...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-bg-orb orb-one" />
        <div className="job-details-bg-orb orb-two" />
        <div className="job-details-bg-grid" />

        <div className="job-details-error">
          <div className="job-error-icon">
            !
          </div>

          <span className="error-eyebrow">
            JOB UNAVAILABLE
          </span>

          <h2>
            {error || "Job not found."}
          </h2>

          <p>
            This opportunity may have been
            removed or is currently unavailable.
          </p>

          <Link
            to="/jobs"
            className="back-btn"
          >
            <span>←</span>
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="job-details-page">
      {/* BACKGROUND */}

      <div className="job-details-bg-orb orb-one" />
      <div className="job-details-bg-orb orb-two" />
      <div className="job-details-bg-orb orb-three" />
      <div className="job-details-bg-grid" />

      <div className="job-details-container">
        {/* BACK */}

        <Link
          to="/jobs"
          className="back-link"
        >
          <span className="back-icon">←</span>
          Back to Jobs
        </Link>

        {/* =====================================
            HERO
        ===================================== */}

        <div className="job-details-card">
          <div className="job-hero">
            <div className="job-company-logo">
              {job.company_name
                ?.charAt(0)
                .toUpperCase() || "H"}
            </div>

            <div className="job-hero-content">
              <div className="job-hero-eyebrow">
                <span className="live-dot" />
                OPEN POSITION
              </div>

              <h1>
                {job.title}
              </h1>

              <h3>
                {job.company_name ||
                  "Company"}
              </h3>

              <div className="job-hero-meta">
                <span>
                  ◎ {job.location ||
                    "Location not specified"}
                </span>

                <span>
                  •
                </span>

                <span>
                  {job.job_type}
                </span>
              </div>
            </div>

            <div className="job-type-badge">
              {job.job_type}
            </div>
          </div>

          {/* =====================================
              JOB SNAPSHOT
          ===================================== */}

          <div className="job-snapshot">
            <div className="snapshot-card">
              <div className="snapshot-icon location">
                ◎
              </div>

              <div>
                <span>
                  LOCATION
                </span>

                <strong>
                  {job.location ||
                    "Not specified"}
                </strong>
              </div>
            </div>

            <div className="snapshot-card">
              <div className="snapshot-icon salary">
                ₹
              </div>

              <div>
                <span>
                  SALARY
                </span>

                <strong>
                  ₹
                  {Number(
                    job.salary
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>

            <div className="snapshot-card">
              <div className="snapshot-icon experience">
                ✦
              </div>

              <div>
                <span>
                  EXPERIENCE
                </span>

                <strong>
                  {job.experience_level}
                </strong>
              </div>
            </div>
          </div>

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <div className="job-details-layout">
            {/* LEFT */}

            <main className="job-details-main">
              {/* DESCRIPTION */}

              <section className="job-section">
                <div className="section-title-row">
                  <div className="section-title-icon">
                    ✦
                  </div>

                  <div>
                    <span>
                      ABOUT THE ROLE
                    </span>

                    <h2>
                      Job Description
                    </h2>
                  </div>
                </div>

                <div className="job-description">
                  {job.description}
                </div>
              </section>

              {/* REQUIREMENTS */}

              <section className="job-section">
                <div className="section-title-row">
                  <div className="section-title-icon requirements-icon">
                    ✓
                  </div>

                  <div>
                    <span>
                      WHAT YOU'LL NEED
                    </span>

                    <h2>
                      Requirements
                    </h2>
                  </div>
                </div>

                <div className="job-description">
                  {job.requirements}
                </div>
              </section>

              {/* AI CAREER NOTE */}

              <div className="job-ai-note">
                <div className="ai-note-icon">
                  ✦
                </div>

                <div>
                  <span>
                    HIRESPHERE AI
                  </span>

                  <strong>
                    Think this role fits your
                    profile?
                  </strong>

                  <p>
                    Use the AI Resume Analyzer
                    to check how well your resume
                    matches this opportunity.
                  </p>
                </div>

                <Link
                  to="/resume-analyzer"
                  className="ai-note-btn"
                >
                  Analyze Resume
                  <span>→</span>
                </Link>
              </div>
            </main>

            {/* RIGHT — APPLY CARD */}

            <aside className="job-apply-sidebar">
              <div className="apply-card">
                <div className="apply-card-top">
                  <span className="apply-card-label">
                    INTERESTED?
                  </span>

                  <div className="apply-card-icon">
                    ↗
                  </div>
                </div>

                <h2>
                  Take the next step.
                </h2>

                <p>
                  Submit your application and
                  put yourself in front of the
                  hiring team.
                </p>

                {/* JOB SEEKER */}

                {role === "JOB_SEEKER" &&
                token ? (
                  <>
                    <button
                      className={`apply-btn ${
                        applied
                          ? "applied"
                          : ""
                      }`}
                      onClick={
                        handleApply
                      }
                      disabled={
                        applying ||
                        applied
                      }
                    >
                      {applied ? (
                        <>
                          <span>✓</span>
                          Already Applied
                        </>
                      ) : applying ? (
                        <>
                          <span className="apply-spinner" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply Now
                          <span>→</span>
                        </>
                      )}
                    </button>

                    {applicationMessage && (
                      <div
                        className={`application-message ${
                          applied
                            ? "success"
                            : "info"
                        }`}
                      >
                        <span>
                          {applied
                            ? "✓"
                            : "i"}
                        </span>

                        <p>
                          {applicationMessage}
                        </p>
                      </div>
                    )}
                  </>
                ) : role === "EMPLOYER" ? (
                  <div className="application-message employer-message">
                    <span>!</span>

                    <p>
                      Employers cannot apply
                      for jobs.
                    </p>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="apply-btn login-apply-btn"
                    >
                      Login as Job Seeker
                      <span>→</span>
                    </Link>

                    <p className="login-hint">
                      Sign in to submit your
                      application.
                    </p>
                  </>
                )}

                <div className="apply-card-footer">
                  <span>✦</span>

                  <p>
                    Your application will be
                    securely submitted through
                    HireSphere.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* FOOTER */}

        <div className="job-details-footer">
          <span>✦</span>
          HireSphere
          <span className="footer-divider">
            •
          </span>
          Find work that moves you forward.
        </div>
      </div>
    </div>
  );
}

export default JobDetails;