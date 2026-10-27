import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Rocket,
  ArrowRight,
  Check,
  AlertCircle
} from "lucide-react";
import api from "../services/api";
import ResumeUpload from "../components/ResumeUpload";
import ATSScore from "../components/ATSScore";
import SkillMatch from "../components/SkillMatch";
import "../css/ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [targetRole, setTargetRole] = useState("Python Full Stack Developer");
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

    if (!targetRole.trim()) {
      setAnalysisError(
        "Please enter a target role to analyze against."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysisResult(null);

      const response = await api.post("/resumes/ai-resume/analyze/", {
        resumeId: uploadedResumeId,
        target_role: targetRole.trim(),
      });

      const data = response.data;
      console.log("AI Resume Analysis Response:", data);

      /*
       * Normalize Django/Groq response
       * into the format expected by React.
       */
      const normalizedResult = {
        ...data,
        atsScore: data.resume_score ?? 0,
        summary: data.professional_summary ?? "",
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        weaknesses: Array.isArray(data.improvement_suggestions) ? data.improvement_suggestions : [],
        missingSkills: Array.isArray(data.missing_skills) ? data.missing_skills : [],
        recommendations: Array.isArray(data.keywords) ? data.keywords : [],
        targetRole: data.target_role ?? targetRole,
        experienceAnalysis: data.experience_analysis ?? "",
        projectAnalysis: data.project_analysis ?? "",
      };

      console.log("Normalized Analysis Result:", normalizedResult);
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
      {/* Background Orbs */}
      <div className="analyzer-bg-orb analyzer-orb-one" />
      <div className="analyzer-bg-orb analyzer-orb-two" />

      {/* Header */}
      <div className="resume-analyzer-header">
        <span className="analyzer-eyebrow">
          <Sparkles size={13} />
          AI-POWERED CAREER INTELLIGENCE
        </span>

        <h1>AI Resume & ATS Analyzer</h1>

        <p>
          Upload your resume and specify your target role to receive comprehensive AI feedback:
          ATS compatibility scoring, skill gap detection, and actionable bullet-point improvements powered by Groq.
        </p>
      </div>

      {/* STEP 1: RESUME UPLOAD */}
      <ResumeUpload
        onUploadSuccess={handleUploadSuccess}
        currentResumeId={uploadedResumeId}
      />

      {/* Uploaded File Indicator */}
      {uploadedResumeId && uploadedFileName && (
        <div className="uploaded-resume-info">
          <FileText size={16} />
          <span>Active Resume: <strong>{uploadedFileName}</strong></span>
        </div>
      )}

      {/* STEP 2: TARGET ROLE */}
      <div className="analyzer-step-card">
        <div className="step-card-header">
          <div className="step-number-icon">
            <Briefcase size={20} />
          </div>

          <div>
            <h2 className="step-card-title">
              Step 2: Define Your Target Role
            </h2>

            <p className="step-card-desc">
              Specify the job title or specialization you are aiming for so our AI can cross-examine industry benchmarks.
            </p>
          </div>
        </div>

        <div className="input-with-label">
          <input
            type="text"
            className="target-role-input"
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              if (analysisError) {
                setAnalysisError("");
              }
            }}
            placeholder="e.g. Senior Frontend Engineer, Full Stack Python Developer, Data Scientist"
            maxLength={150}
            disabled={analyzing}
          />
        </div>
      </div>

      {/* Error Banner */}
      {analysisError && (
        <div className="analyzer-error-banner">
          <AlertTriangle size={18} className="error-banner-icon" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* Analyze Action Section */}
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
              <span>Analyzing with Groq AI...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run AI ATS & Resume Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* STEP 3: RESULTS */}
      {analysisResult && (
        <div className="analyzer-results-wrapper">
          <div className="results-heading-box">
            <div>
              <h2>AI Evaluation Report</h2>
              <p className="results-subheading">Analysis for <strong>{analysisResult.targetRole}</strong></p>
            </div>

            <span className="results-ai-badge">
              <Sparkles size={12} />
              AI Evaluated
            </span>
          </div>

          {/* ATS Score Gauge */}
          <ATSScore score={analysisResult.atsScore} />

          {/* Executive Summary */}
          {analysisResult.summary && (
            <div className="result-card">
              <h3 className="result-card-title">
                <FileText size={18} className="title-icon-primary" />
                Executive Summary
              </h3>

              <p className="result-text">
                {analysisResult.summary}
              </p>
            </div>
          )}

          {/* Strengths & Areas for Improvement Grid */}
          <div className="results-grid-two">
            {/* Strengths */}
            <div className="result-card strengths-card">
              <h3 className="result-card-title">
                <CheckCircle2 size={18} className="title-icon-success" />
                Key Strengths
              </h3>

              {Array.isArray(analysisResult.strengths) && analysisResult.strengths.length > 0 ? (
                <ul className="analysis-list">
                  {analysisResult.strengths.map((item, index) => (
                    <li key={index} className="analysis-list-item strength-item">
                      <span className="item-bullet-icon success">
                        <Check size={13} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="result-text">
                  No specific strengths highlighted.
                </p>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="result-card weaknesses-card">
              <h3 className="result-card-title">
                <AlertCircle size={18} className="title-icon-warning" />
                Areas for Improvement
              </h3>

              {Array.isArray(analysisResult.weaknesses) && analysisResult.weaknesses.length > 0 ? (
                <ul className="analysis-list">
                  {analysisResult.weaknesses.map((item, index) => (
                    <li key={index} className="analysis-list-item warning-item">
                      <span className="item-bullet-icon warning">
                        <AlertTriangle size={13} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="result-text">
                  No critical weaknesses identified.
                </p>
              )}
            </div>
          </div>

          {/* Missing Skills & Gap Analysis */}
          <SkillMatch missingSkills={analysisResult.missingSkills} />

          {/* Actionable Recommendations */}
          {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 && (
            <div className="result-card recommendations-card">
              <h3 className="result-card-title">
                <Lightbulb size={18} className="title-icon-tip" />
                High-Impact Recommendations
              </h3>

              <ul className="recommendations-list">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    <span className="rec-arrow">
                      <ArrowRight size={14} />
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Work Experience Evaluation */}
          {analysisResult.experienceAnalysis && (
            <div className="result-card">
              <h3 className="result-card-title">
                <Briefcase size={18} className="title-icon-primary" />
                Work Experience Evaluation
              </h3>

              <p className="result-text">
                {analysisResult.experienceAnalysis}
              </p>
            </div>
          )}

          {/* Technical Projects Evaluation */}
          {analysisResult.projectAnalysis && (
            <div className="result-card">
              <h3 className="result-card-title">
                <Rocket size={18} className="title-icon-accent" />
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
