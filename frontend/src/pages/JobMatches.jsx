import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  FileText,
  UploadCloud,
  ArrowRight,
  ChevronDown,
  AlertTriangle,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Check,
  X
} from "lucide-react";
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

  // FETCH RESUMES
  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      setError("");

      const response = await api.get("/resumes/my/");
      console.log("My Resumes:", response.data);

      const list = Array.isArray(response.data) ? response.data : [];
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

  // FIND JOB MATCHES
  const handleFindMatches = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to match against available jobs.");
      return;
    }

    try {
      setMatching(true);
      setError("");
      setMatches(null);

      console.log("Finding matches for resume:", selectedResumeId);

      const response = await api.get("/resumes/ai-job-matching/matches/", {
        params: {
          resume_id: selectedResumeId,
        },
      });

      console.log("Job Matching Response:", response.data);
      setMatches(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error finding job matches:", err);

      let errorMsg =
        "Failed to match jobs. Please check your connection and try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMsg = "Your session has expired. Please log in again.";
        } else if (err.response.status === 403) {
          errorMsg =
            err.response.data?.message ||
            "Access denied. Only Job Seekers can access AI Job Matching.";
        } else if (err.response.status === 404) {
          errorMsg = "Job matching endpoint was not found.";
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMsg = err.response.data.error;
        }
      }

      setError(errorMsg);
    } finally {
      setMatching(false);
    }
  };

  // SCORE BADGE
  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    if (score >= 40) return "score-moderate";
    return "score-low";
  };

  return (
    <div className="job-matches-page">
      {/* Background Atmosphere */}
      <div className="matches-bg-orb matches-orb-one"></div>
      <div className="matches-bg-orb matches-orb-two"></div>
      <div className="matches-bg-grid"></div>

      <main className="job-matches-container">
        {/* HERO SECTION */}
        <section className="job-matches-hero">
          <div className="matches-eyebrow">
            <Sparkles size={13} />
            AI-POWERED CAREER INTELLIGENCE
          </div>

          <h1>
            Discover Roles That <span className="gradient-text">Fit Your Profile.</span>
          </h1>

          <p>
            HireSphere compares your technical skills, experience depth, and project work against
            live job openings to compute instant, transparent compatibility scores.
          </p>

          <div className="hero-ai-status">
            <span className="status-pulse"></span>
            AI semantic matching engine active
          </div>
        </section>

        {/* STEP 1: RESUME SELECTION */}
        <section className="resume-selector-card">
          <div className="selector-glow"></div>

          <div className="selector-header">
            <div className="selector-icon-box">
              <Sparkles size={22} />
            </div>

            <div className="selector-heading">
              <div className="section-kicker">STEP 01</div>
              <h2>Select Target Resume</h2>
              <p>
                Choose which uploaded resume profile our AI should benchmark against available positions.
              </p>
            </div>
          </div>

          {loadingResumes ? (
            <div className="matches-loading-inline">
              <span className="inline-spinner"></span>
              <span>Loading your resume profiles...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="no-resumes-prompt">
              <div className="empty-resume-icon">
                <FileText size={24} />
              </div>

              <div className="empty-resume-content">
                <h3>No uploaded resumes found</h3>
                <p>
                  Upload a resume first so HireSphere AI can calculate your compatibility scores across open positions.
                </p>

                <Link to="/resume-analyzer" className="upload-redirect-btn">
                  <UploadCloud size={14} />
                  <span>Upload Resume</span>
                  <ArrowRight size={14} className="button-arrow" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="resume-matching-controls">
              <div className="resume-select-wrapper">
                <label htmlFor="resume-select">ACTIVE RESUME PROFILE</label>

                <div className="select-field">
                  <span className="select-leading-icon">
                    <FileText size={16} />
                  </span>

                  <select
                    id="resume-select"
                    className="resume-select-dropdown"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    disabled={matching}
                  >
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.file_name || `Resume #${resume.id}`} (Uploaded:{" "}
                        {resume.uploaded_at
                          ? new Date(resume.uploaded_at).toLocaleDateString()
                          : "Recent"}
                        )
                      </option>
                    ))}
                  </select>

                  <span className="select-arrow">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="find-matches-btn"
                onClick={handleFindMatches}
                disabled={matching || !selectedResumeId}
              >
                {matching ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Analyzing Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Find My Job Matches</span>
                    <ArrowRight size={16} className="button-arrow" />
                  </>
                )}
              </button>
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="selector-footer">
              <Sparkles size={13} />
              <span>
                AI analyzes skills, seniority requirements, stack compatibility, and responsibilities.
              </span>
            </div>
          )}
        </section>

        {/* ERROR BANNER */}
        {error && (
          <div className="matches-error-banner">
            <div className="error-icon">
              <AlertTriangle size={16} />
            </div>

            <div className="error-content">
              <strong>Unable to match jobs</strong>
              <span>{error}</span>
            </div>

            <button
              type="button"
              className="error-close"
              onClick={() => setError("")}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* RESULTS SECTION */}
        {matches && (
          <section className="matches-results-container">
            <div className="matches-results-header">
              <div>
                <div className="section-kicker">STEP 02 · AI MATCH RANKING</div>
                <h2>Recommended Job Matches</h2>
                <p>
                  Ranked by semantic match score and technical alignment with your chosen resume.
                </p>
              </div>

              <div className="match-count-badge">
                <span className="count-number">{matches.length}</span>
                <span>{matches.length === 1 ? "opportunity" : "opportunities"} ranked</span>
              </div>
            </div>

            {/* EMPTY STATE */}
            {matches.length === 0 ? (
              <div className="matches-empty-state">
                <div className="matches-empty-icon">
                  <Sparkles size={32} />
                </div>

                <h3>No active jobs found</h3>
                <p>
                  There aren't any active job listings matching your profile right now.
                  Check back soon or explore all available jobs in the catalog.
                </p>

                <Link to="/jobs" className="empty-jobs-btn">
                  <span>Browse All Jobs</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="job-matches-list">
                {matches.map((job, index) => (
                  <article key={job.jobId} className="job-match-card">
                    {/* CARD TOP */}
                    <div className="match-card-top">
                      <div className="match-rank">
                        <span>#{index + 1}</span>
                      </div>

                      <div className="match-card-title-group">
                        <div className="job-card-topline">
                          <span className="ai-match-label">
                            <Sparkles size={11} /> AI MATCHED
                          </span>
                        </div>

                        <h3>{job.jobTitle}</h3>

                        <div className="match-card-company">
                          <Building2 size={14} className="company-icon" />
                          <span>{job.companyName}</span>
                        </div>

                        <div className="match-card-meta">
                          {job.location && (
                            <span className="meta-item">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                          )}

                          {job.jobType && (
                            <span className="meta-item">
                              <Briefcase size={12} />
                              {job.jobType}
                            </span>
                          )}

                          {job.experienceLevel && (
                            <span className="meta-item">
                              <GraduationCap size={12} />
                              {job.experienceLevel}
                            </span>
                          )}

                          {job.salary && (
                            <span className="meta-item salary-meta">
                              <IndianRupee size={12} />
                              {Number(job.salary).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* SCORE PILL */}
                      <div className="match-score-wrapper">
                        <div
                          className={`match-score-pill ${getScoreBadgeClass(
                            job.matchScore
                          )}`}
                        >
                          <span className="score-value">{job.matchScore}%</span>
                          <span className="score-label">Match</span>
                        </div>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="match-progress-container">
                      <div className="match-progress-track">
                        <div
                          className={`match-progress-fill ${getScoreBadgeClass(
                            job.matchScore
                          )}`}
                          style={{
                            width: `${Math.min(
                              Math.max(Number(job.matchScore) || 0, 0),
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* MATCHED & MISSING SKILLS ROW */}
                    <div className="match-card-skills-row">
                      {Array.isArray(job.matchedSkills) && job.matchedSkills.length > 0 && (
                        <div className="match-skills-group">
                          <span className="skills-group-label matched-label">
                            <Check size={12} /> Matched Skills
                          </span>

                          <div className="skills-list">
                            {job.matchedSkills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="match-skill-pill matched"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {Array.isArray(job.missingSkills) && job.missingSkills.length > 0 && (
                        <div className="match-skills-group">
                          <span className="skills-group-label missing-label">
                            <AlertCircle size={12} /> Skills to Learn / Add
                          </span>

                          <div className="skills-list">
                            {job.missingSkills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="match-skill-pill missing"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MATCH REASONING */}
                    {job.matchReason && (
                      <div className="match-reason-box">
                        <div className="reason-icon">
                          <Lightbulb size={16} />
                        </div>

                        <div className="reason-content">
                          <span className="reason-label">
                            WHY AI RECOMMENDS THIS POSITION
                          </span>
                          <p>{job.matchReason}</p>
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="match-card-actions">
                      <Link to={`/jobs/${job.jobId}`} className="match-view-btn">
                        View Details
                      </Link>

                      <Link to={`/jobs/${job.jobId}`} className="match-apply-btn">
                        <span>Apply Now</span>
                        <ArrowRight size={14} />
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