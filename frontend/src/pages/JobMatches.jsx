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

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      setError("");

      const response = await api.get("/resumes/my");
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

  const handleFindMatches = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to match against available jobs.");
      return;
    }

    try {
      setMatching(true);
      setError("");
      setMatches(null);

      const response = await api.get("/ai-job-matching/matches", {
        params: { resumeId: selectedResumeId },
      });

      setMatches(response.data);
    } catch (err) {
      console.error("Error finding job matches:", err);
      let errorMsg = "Failed to match jobs. Please check your connection and try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMsg = "Your session has expired. Please log in again.";
        } else if (err.response.status === 403) {
          errorMsg = "Access denied. Only Job Seekers can access AI Job Matching.";
        } else if (err.response.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setMatching(false);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    if (score >= 40) return "score-moderate";
    return "score-low";
  };

  return (
    <div className="job-matches-page">
      {/* Header */}
      <div className="job-matches-header">
        <span className="matches-eyebrow">SMART CAREER COMPATIBILITY</span>
        <h1>🎯 AI Job Matching</h1>
        <p>
          Select your uploaded resume to instantly discover, score, and rank the best-matching job openings
          based on your technical skills, experience, and project background.
        </p>
      </div>

      {/* Resume Selection Card */}
      <div className="resume-selector-card">
        <div className="selector-header">
          <div className="selector-icon-box">📄</div>
          <div>
            <h2 className="selector-title">Select Resume for Job Matching</h2>
            <p className="selector-desc">
              Choose the resume profile you'd like to compare against active job listings.
            </p>
          </div>
        </div>

        {loadingResumes ? (
          <p style={{ color: "#64748b" }}>Loading your uploaded resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="no-resumes-prompt">
            <p>You haven't uploaded any resumes yet.</p>
            <Link to="/resume-analyzer" className="upload-redirect-btn">
              <span>⬆️</span> Upload Resume in Resume Analyzer
            </Link>
          </div>
        ) : (
          <>
            <select
              className="resume-select-dropdown"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              disabled={matching}
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileName || `Resume #${r.id}`} (Uploaded:{" "}
                  {r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : "Recent"})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="find-matches-btn"
              onClick={handleFindMatches}
              disabled={matching || !selectedResumeId}
            >
              {matching ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Matching Your Resume with Available Jobs...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Find Matching Jobs</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="matches-error-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {matches && (
        <div className="matches-results-container">
          <div className="matches-results-header">
            <h2>Recommended Job Openings</h2>
            <span className="match-count-badge">
              {matches.length} Job{matches.length !== 1 ? "s" : ""} Evaluated & Ranked
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="matches-empty-state">
              <div className="matches-empty-icon">💼</div>
              <h3>No Active Jobs Found</h3>
              <p>There are currently no job listings available in the portal to match against.</p>
            </div>
          ) : (
            matches.map((job) => (
              <div key={job.jobId} className="job-match-card">
                <div className="match-card-top">
                  <div className="match-card-title-group">
                    <h3>{job.jobTitle}</h3>
                    <div className="match-card-company">{job.companyName}</div>
                    <div className="match-card-meta">
                      {job.location && (
                        <span className="meta-item">📍 {job.location}</span>
                      )}
                      {job.jobType && (
                        <span className="meta-item">💼 {job.jobType}</span>
                      )}
                      {job.experienceLevel && (
                        <span className="meta-item">🎓 {job.experienceLevel}</span>
                      )}
                      {job.salary && (
                        <span className="meta-item">
                          💰 ${job.salary.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`match-score-pill ${getScoreBadgeClass(job.matchScore)}`}>
                    <span>{job.matchScore}% Match</span>
                  </div>
                </div>

                {/* Skills Analysis Row */}
                <div className="match-card-skills-row">
                  {/* Matched Skills */}
                  {Array.isArray(job.matchedSkills) && job.matchedSkills.length > 0 && (
                    <div className="match-skills-group">
                      <span className="skills-group-label">Matched:</span>
                      {job.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="match-skill-pill matched">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Missing Skills */}
                  {Array.isArray(job.missingSkills) && job.missingSkills.length > 0 && (
                    <div className="match-skills-group">
                      <span className="skills-group-label">Missing:</span>
                      {job.missingSkills.map((skill, idx) => (
                        <span key={idx} className="match-skill-pill missing">
                          ⚠️ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Match Reason Box */}
                {job.matchReason && (
                  <div className="match-reason-box">
                    <strong>Why this job matches:</strong> {job.matchReason}
                  </div>
                )}

                {/* Actions */}
                <div className="match-card-actions">
                  <Link to={`/jobs/${job.jobId}`} className="match-view-btn">
                    View Job Details
                  </Link>
                  <Link to={`/jobs/${job.jobId}`} className="match-apply-btn">
                    Apply Now ➔
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JobMatches;
