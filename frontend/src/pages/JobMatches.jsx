import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/JobMatches.css";

function JobMatches() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  // ==========================================
  // FETCH RESUMES
  // ==========================================

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      setError("");

      const response = await api.get("/resumes/my/");

      console.log("My Resumes:", response.data);

      const list = Array.isArray(response.data)
        ? response.data
        : [];

      setResumes(list);

      if (list.length > 0) {
        setSelectedResumeId(list[0].id.toString());
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your resumes. Please try again."
      );
    } finally {
      setLoadingResumes(false);
    }
  };

  // ==========================================
  // FIND JOB MATCHES
  // ==========================================

  const handleFindMatches = async () => {
    if (!selectedResumeId) {
      setError(
        "Please select a resume to match against available jobs."
      );
      return;
    }

    try {
      setMatching(true);
      setError("");
      setMatches(null);

      console.log(
        "Finding matches for resume:",
        selectedResumeId
      );

      const response = await api.get(
        "/resumes/ai-job-matching/matches/",
        {
          params: {
            resume_id: selectedResumeId,
          },
        }
      );

      console.log(
        "Job Matching Response:",
        response.data
      );

      setMatches(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("Error finding job matches:", err);

      let errorMsg =
        "Failed to match jobs. Please check your connection and try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMsg =
            "Your session has expired. Please log in again.";
        } else if (err.response.status === 403) {
          errorMsg =
            err.response.data?.message ||
            "Access denied. Only Job Seekers can access AI Job Matching.";
        } else if (err.response.status === 404) {
          errorMsg =
            "Job matching endpoint was not found.";
        } else if (err.response.data?.message) {
          errorMsg =
            err.response.data.message;
        } else if (err.response.data?.error) {
          errorMsg =
            err.response.data.error;
        }
      }

      setError(errorMsg);
    } finally {
      setMatching(false);
    }
  };

  // ==========================================
  // SCORE BADGE
  // ==========================================

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    if (score >= 40) return "score-moderate";
    return "score-low";
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="job-matches-page">

      {/* BACKGROUND EFFECTS */}
      <div className="matches-bg-orb matches-orb-one"></div>
      <div className="matches-bg-orb matches-orb-two"></div>
      <div className="matches-bg-grid"></div>

      <main className="job-matches-container">

        {/* =====================================
            HERO
        ====================================== */}

        <section className="job-matches-hero">

          <div className="matches-eyebrow">
            <span className="eyebrow-dot"></span>
            AI-POWERED CAREER INTELLIGENCE
          </div>

          <h1>
            Find Jobs That
            <span className="gradient-text">
              {" "}Match You.
            </span>
          </h1>

          <p>
            Let AI analyze your resume, understand your
            technical profile, and discover opportunities
            that align with your skills and experience.
          </p>

          <div className="hero-ai-status">
            <span className="status-pulse"></span>
            AI matching engine ready
          </div>

        </section>

        {/* =====================================
            RESUME SELECTION
        ====================================== */}

        <section className="resume-selector-card">

          <div className="selector-glow"></div>

          <div className="selector-header">

            <div className="selector-icon-box">
              <span>✦</span>
            </div>

            <div className="selector-heading">

              <div className="section-kicker">
                STEP 01
              </div>

              <h2>
                Choose your resume
              </h2>

              <p>
                Select the resume you want our AI to
                compare against available opportunities.
              </p>

            </div>

          </div>

          {loadingResumes ? (

            <div className="matches-loading-inline">

              <span className="inline-spinner"></span>

              <span>
                Loading your resume profiles...
              </span>

            </div>

          ) : resumes.length === 0 ? (

            <div className="no-resumes-prompt">

              <div className="empty-resume-icon">
                📄
              </div>

              <div className="empty-resume-content">

                <h3>
                  No resume found
                </h3>

                <p>
                  Upload a resume first so HireSphere AI
                  can identify your best job matches.
                </p>

                <Link
                  to="/resume-analyzer"
                  className="upload-redirect-btn"
                >
                  <span>↑</span>
                  Upload Resume
                  <span className="button-arrow">→</span>
                </Link>

              </div>

            </div>

          ) : (

            <div className="resume-matching-controls">

              <div className="resume-select-wrapper">

                <label htmlFor="resume-select">
                  YOUR RESUME
                </label>

                <div className="select-field">

                  <span className="select-leading-icon">
                    📄
                  </span>

                  <select
                    id="resume-select"
                    className="resume-select-dropdown"
                    value={selectedResumeId}
                    onChange={(e) =>
                      setSelectedResumeId(e.target.value)
                    }
                    disabled={matching}
                  >

                    {resumes.map((resume) => (

                      <option
                        key={resume.id}
                        value={resume.id}
                      >

                        {resume.file_name ||
                          `Resume #${resume.id}`}

                        {" "}
                        (
                        Uploaded:{" "}

                        {resume.uploaded_at
                          ? new Date(
                              resume.uploaded_at
                            ).toLocaleDateString()
                          : "Recent"}

                        )

                      </option>

                    ))}

                  </select>

                  <span className="select-arrow">
                   ⌄
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="find-matches-btn"
                onClick={handleFindMatches}
                disabled={
                  matching ||
                  !selectedResumeId
                }
              >

                {matching ? (

                  <>
                    <span className="btn-spinner"></span>

                    <span>
                      Analyzing your profile...
                    </span>
                  </>

                ) : (

                  <>
                    <span className="match-button-icon">
                      ✦
                    </span>

                    <span>
                      Find My Matches
                    </span>

                    <span className="button-arrow">
                      →
                    </span>
                  </>

                )}

              </button>

            </div>

          )}

          {!loadingResumes &&
            resumes.length > 0 && (
              <div className="selector-footer">

                <span>✦</span>

                <span>
                  AI compares skills, experience,
                  role requirements and more.
                </span>

              </div>
            )}

        </section>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (

          <div className="matches-error-banner">

            <div className="error-icon">
              !
            </div>

            <div className="error-content">

              <strong>
                Something went wrong
              </strong>

              <span>
                {error}
              </span>

            </div>

            <button
              type="button"
              className="error-close"
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>

        )}

        {/* =====================================
            RESULTS
        ====================================== */}

        {matches && (

          <section className="matches-results-container">

            <div className="matches-results-header">

              <div>

                <div className="section-kicker">
                  STEP 02 · AI ANALYSIS COMPLETE
                </div>

                <h2>
                  Your Job Matches
                </h2>

                <p>
                  Opportunities ranked according to
                  your resume compatibility.
                </p>

              </div>

              <div className="match-count-badge">

                <span className="count-number">
                  {matches.length}
                </span>

                <span>
                  {matches.length === 1
                    ? "job"
                    : "jobs"}{" "}
                  evaluated
                </span>

              </div>

            </div>

            {/* NO JOBS */}

            {matches.length === 0 ? (

              <div className="matches-empty-state">

                <div className="matches-empty-icon">
                  ✦
                </div>

                <h3>
                  No active jobs found
                </h3>

                <p>
                  There aren't any active job listings
                  available for AI matching right now.
                  Check back soon for new opportunities.
                </p>

                <Link
                  to="/jobs"
                  className="empty-jobs-btn"
                >
                  Browse All Jobs →
                </Link>

              </div>

            ) : (

              <div className="job-matches-list">

                {matches.map((job, index) => (

                  <article
                    key={job.jobId}
                    className="job-match-card"
                  >

                    {/* CARD TOP */}

                    <div className="match-card-top">

                      <div className="match-rank">
                        <span>
                          #{index + 1}
                        </span>
                      </div>

                      <div className="match-card-title-group">

                        <div className="job-card-topline">

                          <span className="ai-match-label">
                            ✦ AI MATCH
                          </span>

                        </div>

                        <h3>
                          {job.jobTitle}
                        </h3>

                        <div className="match-card-company">
                          <span className="company-icon">
                            ◈
                          </span>

                          {job.companyName}
                        </div>

                        <div className="match-card-meta">

                          {job.location && (
                            <span className="meta-item">
                              <span>⌖</span>
                              {job.location}
                            </span>
                          )}

                          {job.jobType && (
                            <span className="meta-item">
                              <span>◉</span>
                              {job.jobType}
                            </span>
                          )}

                          {job.experienceLevel && (
                            <span className="meta-item">
                              <span>◆</span>
                              {job.experienceLevel}
                            </span>
                          )}

                          {job.salary && (
                            <span className="meta-item salary-meta">
                              <span>₹</span>
                              {Number(
                                job.salary
                              ).toLocaleString("en-IN")}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* SCORE */}

                      <div className="match-score-wrapper">

                        <div
                          className={`match-score-pill ${getScoreBadgeClass(
                            job.matchScore
                          )}`}
                        >

                          <span className="score-value">
                            {job.matchScore}%
                          </span>

                          <span className="score-label">
                            Match
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* MATCH BAR */}

                    <div className="match-progress-container">

                      <div className="match-progress-track">

                        <div
                          className={`match-progress-fill ${getScoreBadgeClass(
                            job.matchScore
                          )}`}
                          style={{
                            width: `${Math.min(
                              Math.max(
                                Number(job.matchScore) || 0,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                    {/* SKILLS */}

                    <div className="match-card-skills-row">

                      {Array.isArray(
                        job.matchedSkills
                      ) &&
                        job.matchedSkills.length > 0 && (

                          <div className="match-skills-group">

                            <span className="skills-group-label matched-label">
                              <span>✓</span>
                              Matched skills
                            </span>

                            <div className="skills-list">

                              {job.matchedSkills.map(
                                (skill, skillIndex) => (

                                  <span
                                    key={skillIndex}
                                    className="match-skill-pill matched"
                                  >
                                    {skill}
                                  </span>

                                )
                              )}

                            </div>

                          </div>

                        )}

                      {Array.isArray(
                        job.missingSkills
                      ) &&
                        job.missingSkills.length > 0 && (

                          <div className="match-skills-group">

                            <span className="skills-group-label missing-label">
                              <span>△</span>
                              Skills to improve
                            </span>

                            <div className="skills-list">

                              {job.missingSkills.map(
                                (skill, skillIndex) => (

                                  <span
                                    key={skillIndex}
                                    className="match-skill-pill missing"
                                  >
                                    {skill}
                                  </span>

                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>

                    {/* MATCH REASON */}

                    {job.matchReason && (

                      <div className="match-reason-box">

                        <div className="reason-icon">
                          ✦
                        </div>

                        <div className="reason-content">

                          <span className="reason-label">
                            WHY AI RECOMMENDS THIS
                          </span>

                          <p>
                            {job.matchReason}
                          </p>

                        </div>

                      </div>

                    )}

                    {/* ACTIONS */}

                    <div className="match-card-actions">

                      <Link
                        to={`/jobs/${job.jobId}`}
                        className="match-view-btn"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/jobs/${job.jobId}`}
                        className="match-apply-btn"
                      >
                        <span>
                          Apply Now
                        </span>

                        <span>
                          →
                        </span>
                      </Link>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default JobMatches;