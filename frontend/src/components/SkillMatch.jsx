import React from "react";

function SkillMatch({ missingSkills = [] }) {
  const hasMissingSkills = Array.isArray(missingSkills) && missingSkills.length > 0;

  return (
    <div className="skill-match-container">
      <div className="skill-match-header">
        <h3 className="skill-match-title">
          <span className="skill-match-icon">🎯</span> Missing Skills & Keywords
        </h3>
        {hasMissingSkills && (
          <span className="skill-gap-count-badge">
            {missingSkills.length} gap{missingSkills.length > 1 ? "s" : ""} detected
          </span>
        )}
      </div>

      <p className="skill-match-subtitle">
        Skills required or mentioned in the job description that were not detected in your resume:
      </p>

      {hasMissingSkills ? (
        <div className="skill-pills-list">
          {missingSkills.map((skill, index) => (
            <span key={index} className="skill-pill missing-skill-pill">
              <span className="skill-pill-dot">⚠️</span>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="skill-match-empty">
          <span className="skill-match-success-icon">🎉</span>
          <p>
            <strong>Great job!</strong> No critical missing skills were identified compared to this job description.
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillMatch;
