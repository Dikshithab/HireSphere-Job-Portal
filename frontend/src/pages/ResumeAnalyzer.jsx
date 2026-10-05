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

  localStorage.setItem("latestResumeId", resumeId);

  setUploadedFileName(
    resumeData?.file_name ||
    resumeData?.fileName ||
    `Resume #${resumeId}`
  );

  setAnalysisError("");
};

  const handleAnalyze = async () => {
  if (!uploadedResumeId) {
    setAnalysisError(
      "Please upload your resume in Step 1 before analyzing."
    );
    return;
  }

  if (!jobDescription.trim()) {
    setAnalysisError(
      "Please enter or paste a job description to compare against."
    );
    return;
  }

  try {
    setAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);

    const response = await api.post(
      "/resumes/ai-resume/analyze/",
      {
        // Django backend expects resumeId
        resumeId: uploadedResumeId,

        // Job description
        job_description: jobDescription.trim(),
      }
    );

    const data = response.data;

    console.log("AI Resume Analysis Response:", data);

    /*
     * Normalize Django/Groq response
     * into the format expected by React.
     */
    const normalizedResult = {
      ...data,

      atsScore:
        data.atsScore ??
        data.ats_score ??
        0,

      summary:
        data.summary ??
        data.executive_summary ??
        "",

      strengths:
        Array.isArray(data.strengths)
          ? data.strengths
          : [],

      weaknesses:
        Array.isArray(data.weaknesses)
          ? data.weaknesses
          : [],

      missingSkills:
        Array.isArray(data.missingSkills)
          ? data.missingSkills
          : Array.isArray(data.missing_skills)
          ? data.missing_skills
          : [],

      recommendations:
        Array.isArray(data.recommendations)
          ? data.recommendations
          : [],

      experienceAnalysis:
        data.experienceAnalysis ??
        data.experience_analysis ??
        "",

      projectAnalysis:
        data.projectAnalysis ??
        data.project_analysis ??
        "",
    };

    console.log(
      "Normalized Analysis Result:",
      normalizedResult
    );

    setAnalysisResult(normalizedResult);

  } catch (error) {
    console.error(
      "AI Resume Analysis Error:",
      error.response?.data || error
    );

    let errorMessage =
      "Unable to analyze resume. Please check your network and try again.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        errorMessage =
          data?.error ||
          data?.message ||
          "Invalid resume analysis request.";
      } else if (status === 401) {
        errorMessage =
          "Your session has expired. Please sign in again.";
      } else if (status === 403) {
        errorMessage =
          "Access denied. Please ensure you are logged in with valid credentials.";
      } else if (status === 404) {
        errorMessage =
          "Resume analysis endpoint or resume was not found.";
      } else if (status === 500) {
        errorMessage =
          data?.error ||
          data?.message ||
          "AI analysis failed on the server.";
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (typeof data === "string") {
        errorMessage = data;
      } else {
        errorMessage =
          `Server responded with error (Status ${status}).`;
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

        <span className="analyzer-eyebrow">
          AI POWERED CAREER TOOL
        </span>

        <h1>
          AI Resume & ATS Analyzer
        </h1>

        <p>
          Upload your resume and provide a target job description
          to get deep AI-powered insights, ATS compatibility
          scoring, skill gap detection, and actionable improvement
          recommendations.
        </p>

      </div>

      {/* STEP 1 */}
      <ResumeUpload
        onUploadSuccess={handleUploadSuccess}
        currentResumeId={uploadedResumeId}
      />

      {/* Uploaded File */}
      {uploadedResumeId && uploadedFileName && (
        <div className="uploaded-resume-info">
          📄 <strong>{uploadedFileName}</strong>
        </div>
      )}

      {/* STEP 2 */}
      <div className="analyzer-step-card">

        <div className="step-card-header">

          <div className="step-number-icon">
            💼
          </div>

          <div>

            <h2 className="step-card-title">
              Step 2: Enter Job Description
            </h2>

            <p className="step-card-desc">
              Paste the requirements and responsibilities for
              the role you're targeting.
            </p>

          </div>

        </div>

        <textarea
          className="job-desc-textarea"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);

            if (analysisError) {
              setAnalysisError("");
            }
          }}
          placeholder="Paste the job description, required skills, and responsibilities here..."
          rows={7}
          disabled={analyzing}
        />

      </div>

      {/* Error */}
      {analysisError && (
        <div className="analyzer-error-banner">

          <span>
            ⚠️
          </span>

          <span>
            {analysisError}
          </span>

        </div>
      )}

      {/* Analyze Button */}
      <div className="analyzer-action-section">

        <button
          type="button"
          className="analyze-main-btn"
          onClick={handleAnalyze}
          disabled={
            analyzing ||
            !uploadedResumeId
          }
        >

          {analyzing ? (
            <>
              <span className="btn-spinner"></span>
              <span>
                Analyzing Resume with AI...
              </span>
            </>
          ) : (
            <>
              <span>
                ✨
              </span>

              <span>
                Analyze Resume with AI
              </span>
            </>
          )}

        </button>

      </div>

      {/* STEP 3 */}
      {analysisResult && (
        <div className="analyzer-results-wrapper">

          <div className="results-heading-box">

            <h2>
              Analysis Results
            </h2>

            <span className="results-ai-badge">
              AI Evaluated
            </span>

          </div>

          {/* ATS Score */}
          <ATSScore
            score={analysisResult.atsScore}
          />

          {/* Summary */}
          {analysisResult.summary && (
            <div className="result-card">

              <h3 className="result-card-title">
                <span>📋</span>
                Executive Summary
              </h3>

              <p className="result-text">
                {analysisResult.summary}
              </p>

            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="results-grid-two">

            {/* Strengths */}
            <div className="result-card strengths-card">

              <h3 className="result-card-title">
                <span>✅</span>
                Key Strengths
              </h3>

              {Array.isArray(analysisResult.strengths) &&
              analysisResult.strengths.length > 0 ? (

                <ul className="analysis-list">

                  {analysisResult.strengths.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="analysis-list-item"
                      >

                        <span className="item-bullet-icon">
                          🟢
                        </span>

                        <span>
                          {item}
                        </span>

                      </li>
                    )
                  )}

                </ul>

              ) : (

                <p className="result-text">
                  No specific strengths highlighted.
                </p>

              )}

            </div>

            {/* Weaknesses */}
            <div className="result-card weaknesses-card">

              <h3 className="result-card-title">
                <span>⚠️</span>
                Areas for Improvement
              </h3>

              {Array.isArray(analysisResult.weaknesses) &&
              analysisResult.weaknesses.length > 0 ? (

                <ul className="analysis-list">

                  {analysisResult.weaknesses.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="analysis-list-item"
                      >

                        <span className="item-bullet-icon">
                          🟠
                        </span>

                        <span>
                          {item}
                        </span>

                      </li>
                    )
                  )}

                </ul>

              ) : (

                <p className="result-text">
                  No major weaknesses identified.
                </p>

              )}

            </div>

          </div>

          {/* Missing Skills */}
          <SkillMatch
            missingSkills={
              analysisResult.missingSkills
            }
          />

          {/* Recommendations */}
          {Array.isArray(
            analysisResult.recommendations
          ) &&
          analysisResult.recommendations.length > 0 && (

            <div className="result-card recommendations-card">

              <h3 className="result-card-title">
                <span>💡</span>
                Actionable Recommendations
              </h3>

              <ul className="recommendations-list">

                {analysisResult.recommendations.map(
                  (rec, index) => (

                    <li
                      key={index}
                      className="recommendation-item"
                    >

                      <span>
                        👉
                      </span>

                      <span>
                        {rec}
                      </span>

                    </li>

                  )
                )}

              </ul>

            </div>
          )}

          {/* Experience */}
          {analysisResult.experienceAnalysis && (

            <div className="result-card">

              <h3 className="result-card-title">
                <span>💼</span>
                Work Experience Evaluation
              </h3>

              <p className="result-text">
                {analysisResult.experienceAnalysis}
              </p>

            </div>

          )}

          {/* Projects */}
          {analysisResult.projectAnalysis && (

            <div className="result-card">

              <h3 className="result-card-title">
                <span>🚀</span>
                Technical Projects Evaluation
              </h3>

              <p className="result-text">
                {analysisResult.projectAnalysis}
              </p>

            </div>

          )}

        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;
