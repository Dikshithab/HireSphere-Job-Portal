import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/RecruiterCandidateSearch.css";

function RecruiterCandidateSearch() {

  const [candidates, setCandidates] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {

    setLoading(true);
    setError("");

    try {

      const params = new URLSearchParams();

      if (keyword.trim()) {
        params.append(
          "keyword",
          keyword.trim()
        );
      }

      if (skills.trim()) {
        params.append(
          "skills",
          skills.trim()
        );
      }

      if (status) {
        params.append(
          "status",
          status
        );
      }

      params.append(
        "sort",
        sort
      );

      const response = await api.get(
        `/applications/recruiter-candidates/?${params.toString()}`
      );

      setCandidates(
        response.data?.candidates || []
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.error ||
          "Unable to load candidates."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [sort]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchCandidates();
  };

  const clearFilters = () => {

    setKeyword("");
    setSkills("");
    setStatus("");
    setSort("newest");

    setTimeout(() => {
      fetchCandidates();
    }, 0);
  };

  return (
    <div className="recruiter-candidate-page">

      <div className="recruiter-candidate-container">

        {/* HEADER */}

        <div className="candidate-search-header">

          <div>

            <span className="candidate-search-eyebrow">
              HIRESPHERE RECRUITER
            </span>

            <h1>
              Find Candidates
            </h1>

            <p>
              Search and filter candidates who applied
              to your jobs.
            </p>

          </div>

          <div className="candidate-search-icon">
            🔎
          </div>

        </div>

        {/* SEARCH */}

        <form
          className="candidate-search-box"
          onSubmit={handleSearch}
        >

          <div className="search-field">

            <label>
              Candidate
            </label>

            <input
              type="text"
              placeholder="Name or email"
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
            />

          </div>

          <div className="search-field">

            <label>
              Skills
            </label>

            <input
              type="text"
              placeholder="Python, Django, React"
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
            />

          </div>

          <div className="search-field">

            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option value="">
                All Status
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="SHORTLISTED">
                Shortlisted
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="HIRED">
                Hired
              </option>

            </select>

          </div>

          <div className="search-actions">

            <button
              type="submit"
              className="search-btn"
            >
              Search
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

        </form>

        {/* TOOLBAR */}

        <div className="candidate-toolbar">

          <div>
            <strong>
              {candidates.length}
            </strong>

            <span>
              candidates found
            </span>
          </div>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >

            <option value="newest">
              Newest Applications
            </option>

            <option value="oldest">
              Oldest Applications
            </option>

          </select>

        </div>

        {/* ERROR */}

        {error && (

          <div className="candidate-search-error">
            {error}
          </div>

        )}

        {/* LOADING */}

        {loading ? (

          <div className="candidate-search-loading">

            <div>
              ✦
            </div>

            <h2>
              Finding candidates...
            </h2>

            <p>
              Searching your applications.
            </p>

          </div>

        ) : candidates.length === 0 ? (

          /* EMPTY */

          <div className="candidate-search-empty">

            <div>
              👥
            </div>

            <h2>
              No candidates found
            </h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          /* RESULTS */

          <div className="recruiter-candidate-list">

            {candidates.map((candidate) => (

              <div
                className="recruiter-candidate-card"
                key={candidate.application_id}
              >

                <div className="candidate-card-main">

                  <div className="recruiter-candidate-avatar">
                    {candidate.name
                      ?.charAt(0)
                      .toUpperCase() || "C"}
                  </div>

                  <div className="recruiter-candidate-info">

                    <h2>
                      {candidate.name}
                    </h2>

                    <p>
                      {candidate.email}
                    </p>

                    <span>
                      Applied for{" "}
                      <strong>
                        {candidate.job_title}
                      </strong>
                    </span>

                  </div>

                  <div
                    className={`application-status ${candidate.status.toLowerCase()}`}
                  >
                    {candidate.status}
                  </div>

                </div>

                <div className="candidate-card-meta">

                  <span>
                    📄{" "}
                    {candidate.has_resume
                      ? "Resume Available"
                      : "No Resume"}
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    Applied{" "}
                    {new Date(
                      candidate.applied_at
                    ).toLocaleDateString("en-IN")}
                  </span>

                </div>

                <div className="candidate-card-footer">

                  <Link
                    to={`/candidate-ranking/${candidate.job_id}`}
                    className="rank-candidate-btn"
                  >
                    AI Ranking
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

export default RecruiterCandidateSearch;