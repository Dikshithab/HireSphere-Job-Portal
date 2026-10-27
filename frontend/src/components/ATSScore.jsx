import React from "react";
import { CheckCircle2, Award, Zap } from "lucide-react";
import "../css/ATSScore.css";

function ATSScore({ score, ats_score }) {
  // Support both React camelCase and Django/Groq snake_case
  const rawScore =
    score !== undefined && score !== null
      ? score
      : ats_score;

  const parsedScore = Number(rawScore);

  const numericScore = Number.isFinite(parsedScore)
    ? Math.min(100, Math.max(0, Math.round(parsedScore)))
    : 0;

  const getScoreDetails = (val) => {
    if (val >= 80) {
      return {
        label: "Strong Match",
        statusClass: "match-strong",
        strokeColor: "#10b981",
        message:
          "Your resume aligns exceptionally well with the target job requirements.",
      };
    }

    if (val >= 60) {
      return {
        label: "Good Match",
        statusClass: "match-good",
        strokeColor: "#6366f1",
        message:
          "Your resume matches core qualifications with minor skill or experience gaps.",
      };
    }

    if (val >= 40) {
      return {
        label: "Moderate Match",
        statusClass: "match-moderate",
        strokeColor: "#f59e0b",
        message:
          "Moderate match. Focus on missing critical skills and measurable project achievements.",
      };
    }

    return {
      label: "Needs Improvement",
      statusClass: "match-low",
      strokeColor: "#f43f5e",
      message:
        "Significant skill and experience gaps identified compared to the target role.",
    };
  };

  const details = getScoreDetails(numericScore);

  // SVG circular gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  return (
    <div className={`ats-score-container ${details.statusClass}`}>
      {/* Gauge */}
      <div className="ats-score-gauge-wrapper">
        <svg
          className="ats-score-svg"
          viewBox="0 0 130 130"
          width="130"
          height="130"
          aria-label={`ATS compatibility score ${numericScore} out of 100`}
        >
          {/* Background Track */}
          <circle
            className="ats-score-bg-circle"
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            fill="transparent"
          />

          {/* Progress Circle with dynamic gradient */}
          <circle
            className="ats-score-progress-circle"
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={details.strokeColor}
            fill="transparent"
          />
        </svg>

        <div className="ats-score-center-text">
          <span className="ats-score-number">{numericScore}</span>
          <span className="ats-score-percent">/100</span>
        </div>
      </div>

      {/* Information */}
      <div className="ats-score-info">
        <div className="ats-score-header">
          <div className="ats-score-title-group">
            <span className="ats-score-title">ATS Compatibility Score</span>
            <span className="ats-score-subtitle">Calculated by Groq AI Analyzer</span>
          </div>

          <span className="ats-score-badge">
            <Zap size={13} />
            {details.label}
          </span>
        </div>

        <p className="ats-score-desc">
          {details.message}
        </p>

        {/* Horizontal Meter */}
        <div
          className="ats-score-meter-bar-bg"
          role="progressbar"
          aria-label="ATS compatibility score"
          aria-valuenow={numericScore}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="ats-score-meter-bar-fill"
            style={{
              width: `${numericScore}%`,
              background: details.strokeColor,
            }}
          />
        </div>

        {/* Breakdown Factors */}
        <div className="ats-score-factors-row">
          <span className="ats-factor-tag">
            <CheckCircle2 size={12} /> Skills Match (40%)
          </span>
          <span className="ats-factor-tag">
            <CheckCircle2 size={12} /> Experience (30%)
          </span>
          <span className="ats-factor-tag">
            <CheckCircle2 size={12} /> Projects (15%)
          </span>
          <span className="ats-factor-tag">
            <CheckCircle2 size={12} /> Keywords (15%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default ATSScore;
