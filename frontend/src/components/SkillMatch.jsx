import React from "react";
import { Target, AlertCircle, CheckCircle2 } from "lucide-react";

function SkillMatch({
  missingSkills = [],
  missing_skills = [],
}) {
  // Support both React camelCase and Django/Groq snake_case
  const skills =
    Array.isArray(missingSkills) && missingSkills.length > 0
      ? missingSkills
      : Array.isArray(missing_skills)
      ? missing_skills
      : [];

  const hasMissingSkills = skills.length > 0;

  return (
    <div className="skill-match-container">
      <div className="skill-match-header">
        <h3 className="skill-match-title">
          <span className="skill-match-icon">
            <Target size={18} />
          </span>
          Missing Skills & Target Keywords
        </h3>

        {hasMissingSkills && (
          <span className="skill-gap-count-badge">
            {skills.length} gap{skills.length > 1 ? "s" : ""} detected
          </span>
        )}
      </div>

      <p className="skill-match-subtitle">
        Keywords and competencies required for your target role that are currently missing from your resume:
      </p>

      {hasMissingSkills ? (
        <div className="skill-pills-list">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="skill-pill missing-skill-pill"
            >
              <span className="skill-pill-dot">
                <AlertCircle size={13} />
              </span>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="skill-match-empty">
          <span className="skill-match-success-icon">
            <CheckCircle2 size={26} />
          </span>

          <p>
            <strong>Great alignment!</strong> No critical skill gaps were detected for this role.
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillMatch;
