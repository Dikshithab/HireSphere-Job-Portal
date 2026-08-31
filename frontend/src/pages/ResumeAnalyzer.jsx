import React, { useState } from "react";
import api from "../services/api";
import ResumeUpload from "../components/ResumeUpload";
import ATSScore from "../components/ATSScore";
import SkillMatch from "../components/SkillMatch";
import "../css/ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState("");

  const handleUploadSuccess = (resumeId, resumeData) => {
    setUploadedResumeId(resumeId);
    setUploadedFileName(resumeData?.fileName || `Resume #${resumeId}`);
    setAnalysisError("");
  };

  const handleAnalyze = async () => {
    if (!uploadedResumeId) {
      setAnalysisError("Please upload your resume in Step 1 before analyzing.");
      return;
    }

    if (!jobDescription.trim()) {
      setAnalysisError("Please enter or paste a job description to compare against.");
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysisResult(null);

      // Call the AI Resume Analysis endpoint using api.js (JWT attached via interceptor)
      const response = await api.post(
        "/ai-resume/analyze",
        {
          resumeId: uploadedResumeId,
          jobDescription: jobDescription.trim(),
        }
      );

      setAnalysisResult(response.data);
    } catch (err) {
      console.error("AI Resume Analysis Error:", err);

      let errorMessage = "Unable to analyze resume. Please check your network and try again.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401) {
          errorMessage = "Your session has expired. Please sign in again.";
        } else if (status === 403) {
          errorMessage = "Access denied. Please ensure you are logged in with valid credentials.";
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else {
          errorMessage = `Server responded with error (Status ${status}).`;
        }
      }

      setAnalysisError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="resume-analyzer-page">
      {/* Header */}
      <div className="resume-analyzer-header">
        <span className="analyzer-eyebrow">AI POWERED CAREER TOOL</span>
        <h1>AI Resume & ATS Analyzer</h1>
        <p>
          Upload your resume and provide a target job description to get deep AI-powered insights,
          ATS compatibility scoring, skill gap detection, and actionable improvement recommendations.
        </p>
      </div>

      {/* STEP 1: Upload Resume */}
      <ResumeUpload
        onUploadSuccess={handleUploadSuccess}
        currentResumeId={uploadedResumeId}
      />

      {/* STEP 2: Job Description */}
      <div className="analyzer-step-card">
        <div className="step-card-header">
          <div className="step-number-icon">💼</div>
          <div>
            <h2 className="step-card-title">Step 2: Enter Job Description</h2>
            <p className="step-card-desc">
              Paste the requirements and responsibilities for the role you're targeting.
            </p>
          </div>
        </div>

        <textarea
          className="job-desc-textarea"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            if (analysisError) setAnalysisError("");
          }}
          placeholder="Paste the job description, required skills, and responsibilities here..."
          rows={7}
          disabled={analyzing}
        />
      </div>

      {/* Error Alert */}
      {analysisError && (
        <div className="analyzer-error-banner">
          <span>⚠️</span>
          <span>{analysisError}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="analyzer-action-section">
        <button
          type="button"
          className="analyze-main-btn"
          onClick={handleAnalyze}
          disabled={analyzing || !uploadedResumeId}
        >
          {analyzing ? (
            <>
              <span className="btn-spinner"></span>
              <span>Analyzing Resume with AI...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Analyze Resume with AI</span>
            </>
          )}
        </button>
      </div>

      {/* STEP 3: Results Display */}
      {analysisResult && (
        <div className="analyzer-results-wrapper">
          <div className="results-heading-box">
            <h2>Analysis Results</h2>
            <span className="results-ai-badge">AI GPT-4o Evaluated</span>
          </div>

          {/* 1. ATS Score Meter */}
          <ATSScore score={analysisResult.atsScore} />

          {/* 2. Executive Summary */}
          {analysisResult.summary && (
            <div className="result-card">
              <h3 className="result-card-title">
                <span>📋</span> Executive Summary
              </h3>
              <p className="result-text">{analysisResult.summary}</p>
            </div>
          )}

          {/* 3. Strengths & Weaknesses Grid */}
          <div className="results-grid-two">
            {/* Strengths */}
            <div className="result-card strengths-card">
              <h3 className="result-card-title">
                <span>✅</span> Key Strengths
              </h3>
              {Array.isArray(analysisResult.strengths) && analysisResult.strengths.length > 0 ? (
                <ul className="analysis-list">
                  {analysisResult.strengths.map((item, index) => (
                    <li key={index} className="analysis-list-item">
                      <span className="item-bullet-icon">🟢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="result-text">No specific strengths highlighted.</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="result-card weaknesses-card">
              <h3 className="result-card-title">
                <span>⚠️</span> Areas for Improvement
              </h3>
              {Array.isArray(analysisResult.weaknesses) && analysisResult.weaknesses.length > 0 ? (
                <ul className="analysis-list">
                  {analysisResult.weaknesses.map((item, index) => (
                    <li key={index} className="analysis-list-item">
                      <span className="item-bullet-icon">🟠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="result-text">No major weaknesses identified.</p>
              )}
            </div>
          </div>

          {/* 4. Missing Skills Component */}
          <SkillMatch missingSkills={analysisResult.missingSkills} />

          {/* 5. Actionable Recommendations */}
          {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 && (
            <div className="result-card recommendations-card">
              <h3 className="result-card-title">
                <span>💡</span> Actionable Recommendations
              </h3>
              <ul className="recommendations-list">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    <span>👉</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 6. Experience Analysis */}
          {analysisResult.experienceAnalysis && (
            <div className="result-card">
              <h3 className="result-card-title">
                <span>💼</span> Work Experience Evaluation
              </h3>
              <p className="result-text">{analysisResult.experienceAnalysis}</p>
            </div>
          )}

          {/* 7. Project Analysis */}
          {analysisResult.projectAnalysis && (
            <div className="result-card">
              <h3 className="result-card-title">
                <span>🚀</span> Technical Projects Evaluation
              </h3>
              <p className="result-text">{analysisResult.projectAnalysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;