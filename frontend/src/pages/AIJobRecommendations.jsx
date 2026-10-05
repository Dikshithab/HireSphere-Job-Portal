import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/AIJobRecommendations.css";

function AIJobRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get(
          "/resumes/ai-job-recommendations/"
        );

        setRecommendations(
          response.data?.recommendations || []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.error ||
            "Unable to load AI job recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="ai-recommendations-page">
        <div className="ai-recommendations-loading">
          <div className="ai-loading-icon">✦</div>
          <h2>Finding your best matches...</h2>
          <p>
            HireSphere AI is comparing your resume
            with available opportunities.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-recommendations-page">
        <div className="ai-recommendations-error">
          <div>!</div>
          <h2>Unable to generate recommendations</h2>
          <p>{error}</p>

          <Link to="/resume-analyzer">
            Upload / Analyze Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations-page">

      <div className="ai-recommendations-container">

        {/* HEADER */}

        <div className="ai-recommendations-header">

          <div>
            <span className="ai-eyebrow">
              HIRESPHERE AI
            </span>

            <h1>
              Jobs Recommended For You
            </h1>

            <p>
              AI-powered recommendations based on
              your resume, skills and experience.
            </p>
          </div>

          <div className="ai-header-icon">
            ✦
          </div>

        </div>

        {/* EMPTY */}

        {recommendations.length === 0 ? (
          <div className="no-recommendations">

            <div className="empty-icon">
              🔎
            </div>

            <h2>
              No strong matches found
            </h2>

            <p>
              Try improving your resume or adding
              more relevant skills.
            </p>

            <Link to="/resume-analyzer">
              Improve My Resume
            </Link>

          </div>
        ) : (

          <div className="recommendation-list">

            {recommendations.map((job) => (

              <div
                className="recommendation-card"
                key={job.job_id}
              >

                {/* TOP */}

                <div className="recommendation-top">

                  <div className="company-logo">
                    {job.company
                      ?.charAt(0)
                      .toUpperCase() || "H"}
                  </div>

                  <div className="job-heading">

                    <h2>
                      {job.title}
                    </h2>

                    <p>
                      {job.company}
                    </p>

                  </div>

                  <div className="match-score">

                    <strong>
                      {job.match_percentage}%
                    </strong>

                    <span>
                      Match
                    </span>

                  </div>

                </div>

                {/* META */}

                <div className="recommendation-meta">

                  <span>
                    ◎ {job.location || "Remote"}
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {job.job_type}
                  </span>

                  {job.salary && (
                    <>
                      <span>
                        •
                      </span>

                      <span>
                        ₹
                        {Number(
                          job.salary
                        ).toLocaleString("en-IN")}
                      </span>
                    </>
                  )}

                </div>

                {/* REASON */}

                <div className="recommendation-reason">

                  <span>
                    ✦ Why this matches
                  </span>

                  <p>
                    {job.reason}
                  </p>

                </div>

                {/* SKILLS */}

                <div className="recommendation-skills">

                  <div>
                    <h4>
                      Matched Skills
                    </h4>

                    <div className="skill-tags">

                      {job.matched_skills
                        ?.length > 0 ? (
                        job.matched_skills.map(
                          (skill, index) => (
                            <span
                              className="matched"
                              key={index}
                            >
                              ✓ {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span>
                          No skills identified
                        </span>
                      )}

                    </div>
                  </div>

                  <div>
                    <h4>
                      Skills to Improve
                    </h4>

                    <div className="skill-tags">

                      {job.missing_skills
                        ?.length > 0 ? (
                        job.missing_skills.map(
                          (skill, index) => (
                            <span
                              className="missing"
                              key={index}
                            >
                              + {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span>
                          No major gaps
                        </span>
                      )}

                    </div>
                  </div>

                </div>

                {/* ACTION */}

                <div className="recommendation-footer">

                  <Link
                    to={`/jobs/${job.job_id}`}
                    className="view-job-btn"
                  >
                    View Job
                    <span>→</span>
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AIJobRecommendations;