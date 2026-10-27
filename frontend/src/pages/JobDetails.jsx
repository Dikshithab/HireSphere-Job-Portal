import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Briefcase,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import api from "../services/api";
import "../css/JobDetails.css";

function JobDetails() {
  const { id } = useParams();

  // ==========================================
  // STATE
  // ==========================================

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  // AI JOB MATCHING
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState("");

  // ==========================================
  // AUTH
  // ==========================================

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
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
        const response = await api.get(`/jobs/${id}/`, {
          skipAuth: true,
        });

        console.log("Job Details:", response.data);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
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
      if (!token || role !== "JOB_SEEKER") {
        return;
      }

      try {
        const response = await api.get("/applications/my/");
        const applications = Array.isArray(response.data)
          ? response.data
          : response.data?.applications || [];

        const alreadyApplied = applications.some(
          (application) => Number(application.job) === Number(id)
        );

        if (alreadyApplied) {
          setApplied(true);
          setApplicationMessage("You have already applied for this job.");
        }
      } catch (error) {
        console.error("Error checking application:", error);
      }
    };

    checkApplication();
  }, [id, token, role]);

  // ==========================================
  // APPLY FOR JOB
  // ==========================================

  const handleApply = async () => {
    const currentToken = localStorage.getItem("token");
    const storedCurrentUser = localStorage.getItem("user");
    let currentUser = null;

    try {
      currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
    } catch (error) {
      console.error("Invalid user data:", error);
    }

    const currentRole = currentUser?.role;

    if (!currentToken) {
      setApplicationMessage("Please login as a job seeker to apply.");
      return;
    }

    if (currentRole !== "JOB_SEEKER") {
      setApplicationMessage("Only job seekers can apply for jobs.");
      return;
    }

    if (applied) {
      setApplicationMessage("You have already applied for this job.");
      return;
    }

    setApplying(true);
    setApplicationMessage("");

    try {
      const response = await api.post(`/applications/jobs/${id}/apply/`);
      console.log("Application submitted:", response.data);
      setApplied(true);
      setApplicationMessage("Application submitted successfully!");
    } catch (error) {
      console.error("Application Error:", error);

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
          typeof backendMessage === "string" &&
          backendMessage.toLowerCase().includes("already applied")
        ) {
          setApplied(true);
        }
      } else {
        setApplicationMessage("Cannot connect to server.");
      }
    } finally {
      setApplying(false);
    }
  };

  // ==========================================
  // AI JOB MATCHING
  // ==========================================

  const handleAIMatch = async () => {
    try {
      setMatching(true);
      setMatchError("");
      setMatchResult(null);

      const currentToken = localStorage.getItem("token");
      const storedCurrentUser = localStorage.getItem("user");
      let currentUser = null;

      try {
        currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
      } catch (error) {
        console.error("Invalid user data:", error);
      }

      if (!currentToken) {
        setMatchError("Please login as a job seeker to use AI Job Matching.");
        return;
      }

      if (currentUser?.role !== "JOB_SEEKER") {
        setMatchError("AI Job Matching is available for job seekers only.");
        return;
      }

      const resumeId = localStorage.getItem("latestResumeId");

      if (!resumeId) {
        setMatchError(
          "Please upload your resume in Resume Analyzer before using AI Match."
        );
        return;
      }

      const response = await api.post(`/resumes/ai-job-match/${id}/`, {
        resume_id: Number(resumeId),
      });

      console.log("AI Job Match:", response.data);
      setMatchResult(response.data);
    } catch (error) {
      console.error("AI Job Match Error:", error);
      setMatchError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Unable to analyze your match right now."
      );
    } finally {
      setMatching(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-bg-orb orb-one" />
        <div className="job-details-bg-orb orb-two" />
        <div className="job-details-bg-grid" />

        <div className="job-details-loading">
          <div className="job-loading-spinner" />
          <h2>Loading opportunity</h2>
          <p>Fetching full job description and company details...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error || !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-bg-orb orb-one" />
        <div className="job-details-bg-orb orb-two" />
        <div className="job-details-bg-grid" />

        <div className="job-details-error">
          <div className="job-error-icon">
            <AlertCircle className="error-svg" />
          </div>

          <span className="error-eyebrow">JOB UNAVAILABLE</span>
          <h2>{error || "Job not found."}</h2>
          <p>
            This opportunity may have been removed or is currently inactive.
          </p>

          <Link to="/jobs" className="back-btn">
            <ArrowLeft className="back-btn-icon" />
            <span>Back to Jobs</span>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN COMPONENT
  // ==========================================

  return (
    <div className="job-details-page">
      {/* BACKGROUND */}
      <div className="job-details-bg-orb orb-one" />
      <div className="job-details-bg-orb orb-two" />
      <div className="job-details-bg-orb orb-three" />
      <div className="job-details-bg-grid" />

      <div className="job-details-container">
        {/* BACK LINK */}
        <Link to="/jobs" className="back-link">
          <ArrowLeft className="back-icon" />
          <span>Back to Jobs</span>
        </Link>

        {/* HERO CARD */}
        <div className="job-details-card">
          <div className="job-hero">
            <div className="job-company-logo">
              {job.company_name?.charAt(0).toUpperCase() || "H"}
            </div>

            <div className="job-hero-content">
              <div className="job-hero-eyebrow">
                <span className="live-dot" />
                OPEN POSITION
              </div>

              <h1>{job.title}</h1>
              <h3>{job.company_name || "Company"}</h3>

              <div className="job-hero-meta">
                <span className="hero-meta-item">
                  <MapPin className="meta-icon" />
                  {job.location || "Location not specified"}
                </span>

                <span className="meta-dot">•</span>

                <span className="hero-meta-item">
                  <Briefcase className="meta-icon" />
                  {job.job_type}
                </span>

                {job.remote && (
                  <>
                    <span className="meta-dot">•</span>
                    <span className="hero-meta-badge">Remote</span>
                  </>
                )}
              </div>
            </div>

            <div className="job-type-badge">{job.job_type}</div>
          </div>

          {/* SNAPSHOT ROW */}
          <div className="job-snapshot">
            <div className="snapshot-card">
              <div className="snapshot-icon location">
                <MapPin className="snap-svg" />
              </div>
              <div>
                <span>LOCATION</span>
                <strong>{job.location || "Not specified"}</strong>
              </div>
            </div>

            <div className="snapshot-card">
              <div className="snapshot-icon salary">
                <IndianRupee className="snap-svg" />
              </div>
              <div>
                <span>SALARY</span>
                <strong>
                  {job.salary
                    ? `₹${Number(job.salary).toLocaleString("en-IN")}`
                    : "Not specified"}
                </strong>
              </div>
            </div>

            <div className="snapshot-card">
              <div className="snapshot-icon experience">
                <GraduationCap className="snap-svg" />
              </div>
              <div>
                <span>EXPERIENCE</span>
                <strong>{job.experience_level || "Not specified"}</strong>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT + SIDEBAR LAYOUT */}
          <div className="job-details-layout">
            {/* LEFT / MAIN */}
            <main className="job-details-main">
              {/* DESCRIPTION */}
              <section className="job-section">
                <div className="section-title-row">
                  <div className="section-title-icon">
                    <Briefcase className="sec-title-svg" />
                  </div>
                  <div>
                    <span>ABOUT THE ROLE</span>
                    <h2>Job Description</h2>
                  </div>
                </div>

                <div className="job-description-text">{job.description}</div>
              </section>

              {/* REQUIREMENTS */}
              <section className="job-section">
                <div className="section-title-row">
                  <div className="section-title-icon requirements-icon">
                    <Check className="sec-title-svg" />
                  </div>
                  <div>
                    <span>WHAT YOU'LL NEED</span>
                    <h2>Requirements & Skills</h2>
                  </div>
                </div>

                <div className="job-description-text">{job.requirements}</div>
              </section>

              {/* =====================================
                  AI CAREER NOTE
              ===================================== */}
              <div className="job-ai-note">
                <div className="ai-note-icon">
                  <Sparkles className="ai-sparkle-svg" />
                </div>

                <div className="ai-note-text">
                  <span>HIRESPHERE AI</span>
                  <strong>Evaluate your match for this role</strong>
                  <p>
                    Compare your uploaded resume against this job's skills and requirements using our Groq-powered AI engine.
                  </p>
                </div>

                {role === "JOB_SEEKER" && token ? (
                  <button
                    type="button"
                    className="ai-note-btn"
                    onClick={handleAIMatch}
                    disabled={matching}
                  >
                    {matching ? (
                      <>
                        <span className="apply-spinner" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="btn-spark-icon" />
                        <span>AI Match</span>
                        <ArrowRight className="btn-arr" />
                      </>
                    )}
                  </button>
                ) : (
                  <Link to="/login" className="ai-note-btn">
                    <span>Login to Match</span>
                    <ArrowRight className="btn-arr" />
                  </Link>
                )}
              </div>

              {/* AI MATCH ERROR */}
              {matchError && (
                <div className="application-message info">
                  <Info className="msg-icon" />
                  <p>{matchError}</p>
                </div>
              )}

              {/* AI MATCH RESULT */}
              {matchResult && (
                <section className="ai-match-result">
                  <div className="ai-match-header">
                    <div>
                      <span className="match-kicker">HIRESPHERE AI</span>
                      <h2>Job Match Analysis</h2>
                    </div>

                    <div className="match-score">
                      <strong>{matchResult.match_percentage}%</strong>
                      <span>Match</span>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  {matchResult.summary && (
                    <div className="ai-match-summary">
                      <p>{matchResult.summary}</p>
                    </div>
                  )}

                  {/* SKILLS */}
                  <div className="ai-match-columns">
                    {/* MATCHED SKILLS */}
                    <div className="match-section">
                      <h3>
                        <CheckCircle2 className="skill-check-svg" />
                        Matched Skills
                      </h3>

                      {matchResult.matched_skills?.length > 0 ? (
                        <div className="skill-list">
                          {matchResult.matched_skills.map((skill, index) => (
                            <span key={index} className="skill-tag matched">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-skill-text">No matching skills detected.</p>
                      )}
                    </div>

                    {/* MISSING SKILLS */}
                    <div className="match-section">
                      <h3>
                        <AlertCircle className="skill-alert-svg" />
                        Skills to Improve
                      </h3>

                      {matchResult.missing_skills?.length > 0 ? (
                        <div className="skill-list">
                          {matchResult.missing_skills.map((skill, index) => (
                            <span key={index} className="skill-tag missing">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-skill-text">No major gaps identified.</p>
                      )}
                    </div>
                  </div>

                  {/* EXPERIENCE MATCH */}
                  {matchResult.experience_match && (
                    <div className="experience-match">
                      <h3>Experience Alignment</h3>
                      <p>{matchResult.experience_match}</p>
                    </div>
                  )}

                  {/* RECOMMENDATION */}
                  {matchResult.recommendation && (
                    <div className="ai-recommendation">
                      <strong>AI Recommendation</strong>
                      <p>{matchResult.recommendation}</p>
                    </div>
                  )}
                </section>
              )}
            </main>

            {/* RIGHT SIDEBAR — APPLY CARD */}
            <aside className="job-apply-sidebar">
              <div className="apply-card">
                <div className="apply-card-top">
                  <span className="apply-card-label">READY TO APPLY?</span>
                  <div className="apply-card-icon">
                    <ArrowRight className="apply-top-svg" />
                  </div>
                </div>

                <h2>Take the next step.</h2>
                <p>
                  Submit your application and put your profile directly in front of the hiring team.
                </p>

                {role === "JOB_SEEKER" && token ? (
                  <>
                    <button
                      type="button"
                      className={`apply-btn ${applied ? "applied" : ""}`}
                      onClick={handleApply}
                      disabled={applying || applied}
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="applied-svg" />
                          <span>Already Applied</span>
                        </>
                      ) : applying ? (
                        <>
                          <span className="apply-spinner" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="apply-arr" />
                        </>
                      )}
                    </button>

                    {applicationMessage && (
                      <div
                        className={`application-message ${
                          applied ? "success" : "info"
                        }`}
                      >
                        {applied ? (
                          <CheckCircle2 className="msg-icon" />
                        ) : (
                          <Info className="msg-icon" />
                        )}
                        <p>{applicationMessage}</p>
                      </div>
                    )}
                  </>
                ) : role === "EMPLOYER" ? (
                  <div className="application-message employer-message">
                    <Info className="msg-icon" />
                    <p>Employers cannot apply for jobs.</p>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="apply-btn login-apply-btn">
                      <span>Login as Job Seeker</span>
                      <ArrowRight className="apply-arr" />
                    </Link>
                    <p className="login-hint">Sign in to submit your application.</p>
                  </>
                )}

                <div className="apply-card-footer">
                  <ShieldCheck className="shield-svg" />
                  <p>
                    Your application is encrypted and securely sent to the employer.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* FOOTER */}
        <div className="job-details-footer">
          <Sparkles className="footer-spark" />
          <span>HireSphere</span>
          <span className="footer-divider">•</span>
          <span>Find work that moves you forward</span>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
