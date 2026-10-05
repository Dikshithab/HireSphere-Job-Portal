import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/CandidateRanking.css";

function CandidateRanking() {
  const { jobId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get(
          `/applications/ai-candidate-ranking/${jobId}/`
        );

        setData(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.error ||
            "Unable to load candidate ranking."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [jobId]);

  if (loading) {
    return (
      <div className="candidate-ranking-page">
        <div className="ranking-loading">
          <div className="ranking-loading-icon">✦</div>

          <h2>Analyzing candidates...</h2>

          <p>
            HireSphere AI is comparing resumes with
            the job requirements.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-ranking-page">
        <div className="ranking-error">
          <div className="ranking-error-icon">
            !
          </div>

          <h2>Unable to generate ranking</h2>

          <p>{error}</p>

          <Link to="/recruiter-dashboard">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-ranking-page">

      <div className="candidate-ranking-container">

        {/* HEADER */}

        <div className="ranking-header">

          <div>

            <span className="ranking-eyebrow">
              HIRESPHERE AI
            </span>

            <h1>
              Candidate Ranking
            </h1>

            <p>
              AI-powered candidate matching for
              your job posting.
            </p>

          </div>

          <div className="ranking-header-icon">
            ✦
          </div>

        </div>

        {/* JOB INFO */}

        <div className="ranking-job-card">

          <div className="ranking-job-icon">
            💼
          </div>

          <div>
            <span>
              JOB POSTING
            </span>

            <h2>
              {data?.job?.title}
            </h2>

            <p>
              {data?.job?.company}
            </p>
          </div>

          <div className="candidate-total">
            <strong>
              {data?.total_candidates || 0}
            </strong>

            <span>
              Candidates
            </span>
          </div>

        </div>

        {/* EMPTY */}

        {data?.candidates?.length === 0 ? (

          <div className="no-candidates">

            <div className="empty-candidate-icon">
              👥
            </div>

            <h2>
              No candidates yet
            </h2>

            <p>
              Candidates will appear here after
              applying to this job.
            </p>

          </div>

        ) : (

          <div className="candidate-list">

            {data.candidates.map(
              (candidate, index) => (

                <div
                  className="candidate-card"
                  key={candidate.application_id}
                >

                  {/* TOP */}

                  <div className="candidate-top">

                    <div className="candidate-rank">
                      #{index + 1}
                    </div>

                    <div className="candidate-avatar">
                      {candidate.name
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <div className="candidate-info">

                      <h2>
                        {candidate.name}
                      </h2>

                      <p>
                        {candidate.email}
                      </p>

                    </div>

                    <div className="candidate-match">

                      <strong>
                        {candidate.match_percentage}%
                      </strong>

                      <span>
                        Match
                      </span>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="candidate-meta">

                    <span>
                      Application:{" "}
                      <strong>
                        {candidate.status}
                      </strong>
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      Experience:{" "}
                      <strong>
                        {candidate.experience_match}
                      </strong>
                    </span>

                  </div>

                  {/* SUMMARY */}

                  <div className="candidate-summary">

                    <span>
                      ✦ AI Assessment
                    </span>

                    <p>
                      {candidate.summary}
                    </p>

                  </div>

                  {/* SKILLS */}

                  <div className="candidate-skills">

                    <div>

                      <h4>
                        Matched Skills
                      </h4>

                      <div className="skill-tags">

                        {candidate.matched_skills
                          ?.length > 0 ? (

                          candidate.matched_skills.map(
                            (skill, skillIndex) => (
                              <span
                                className="candidate-skill matched"
                                key={skillIndex}
                              >
                                ✓ {skill}
                              </span>
                            )
                          )

                        ) : (

                          <span className="no-skill">
                            No matching skills identified
                          </span>

                        )}

                      </div>

                    </div>

                    <div>

                      <h4>
                        Skills to Improve
                      </h4>

                      <div className="skill-tags">

                        {candidate.missing_skills
                          ?.length > 0 ? (

                          candidate.missing_skills.map(
                            (skill, skillIndex) => (
                              <span
                                className="candidate-skill missing"
                                key={skillIndex}
                              >
                                + {skill}
                              </span>
                            )
                          )

                        ) : (

                          <span className="no-skill">
                            No major skill gaps
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="candidate-footer">

                    <Link
                      to={`/applications/${candidate.application_id}`}
                      className="view-application-btn"
                    >
                      View Application
                      <span>→</span>
                    </Link>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default CandidateRanking;