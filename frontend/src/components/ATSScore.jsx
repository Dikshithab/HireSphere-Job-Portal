import React from "react";
import "../css/ATSScore.css";

function ATSScore({ score }) {
  const numericScore =
    typeof score === "number"
      ? Math.min(100, Math.max(0, Math.round(score)))
      : 0;

  const getScoreDetails = (val) => {
    if (val >= 80) {
      return {
        label: "Strong Match",
        statusClass: "match-strong",
        message:
          "Your resume aligns exceptionally well with the target job requirements.",
      };
    }
    if (val >= 60) {
      return {
        label: "Good Match",
        statusClass: "match-good",
        message:
          "Your resume matches core qualifications with minor skill or experience gaps.",
      };
    }
    if (val >= 40) {
      return {
        label: "Moderate Match",
        statusClass: "match-moderate",
        message:
          "Moderate match. Focus on missing critical skills and measurable project achievements.",
      };
    }
    return {
      label: "Low Match",
      statusClass: "match-low",
      message:
        "Significant skill and experience gaps identified compared to the target role.",
    };
  };

  const details = getScoreDetails(numericScore);

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (numericScore / 100) * circumference;

  return (
    <div className={`ats-score-container ${details.statusClass}`}>
      {/* Gauge Visual */}
      <div className="ats-score-gauge-wrapper">
        <svg
          className="ats-score-svg"
          viewBox="0 0 130 130"
          width="130"
          height="130"
        >
          <circle
            className="ats-score-bg-circle"
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            className="ats-score-progress-circle"
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="ats-score-center-text">
          <span className="ats-score-number">{numericScore}</span>
          <span className="ats-score-percent">/100</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="ats-score-info">
        <div className="ats-score-header">
          <span className="ats-score-title">ATS Compatibility Score</span>
          <span className="ats-score-badge">{details.label}</span>
        </div>

        <p className="ats-score-desc">{details.message}</p>

        {/* Horizontal Meter */}
        <div
          className="ats-score-meter-bar-bg"
          role="progressbar"
          aria-valuenow={numericScore}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="ats-score-meter-bar-fill"
            style={{ width: `${numericScore}%` }}
          />
        </div>

        {/* Breakdown Factors */}
        <div className="ats-score-factors-row">
          <span className="ats-factor-tag">✓ Skills Match (40%)</span>
          <span className="ats-factor-tag">✓ Experience (30%)</span>
          <span className="ats-factor-tag">✓ Projects (15%)</span>
          <span className="ats-factor-tag">✓ Keywords (15%)</span>
        </div>
      </div>
    </div>
  );
}

export default ATSScore;