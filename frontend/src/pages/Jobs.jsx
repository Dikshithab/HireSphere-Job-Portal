import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [remote, setRemote] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  // ==========================================
  // FETCH JOBS
  // ==========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.keyword) {
        params.keyword = filters.keyword;
      }

      if (filters.location) {
        params.location = filters.location;
      }

      if (filters.jobType) {
        params.job_type = filters.jobType;
      }

      if (filters.skills) {
        params.skills = filters.skills;
      }

      if (filters.experience) {
        params.experience = filters.experience;
      }

      if (filters.minSalary) {
        params.min_salary = filters.minSalary;
      }

      if (filters.maxSalary) {
        params.max_salary = filters.maxSalary;
      }

      if (filters.remote !== undefined && filters.remote !== "") {
        params.remote = filters.remote;
      }

      console.log("Searching jobs with:", params);

      const response = await api.get("/jobs/", {
        params,
        skipAuth: true,
      });

      console.log("Jobs received:", response.data);

      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);

      if (error.code === "ERR_NETWORK") {
        setError(
          "Backend server is not running. Please start Django."
        );
      } else {
        setError("Unable to load jobs.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Django now performs filtering.
  const filteredJobs = jobs;

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setSkills("");
    setExperience("");
    setMinSalary("");
    setMaxSalary("");
    setRemote("");

    fetchJobs();
  };
  const toggleSaveJob = async (jobId) => {
  try {
    const isSaved = savedJobs[jobId];

    if (isSaved) {
      await api.delete(`/jobs/${jobId}/save/`);
    } else {
      await api.post(`/jobs/${jobId}/save/`);
    }

    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: !isSaved,
    }));

  } catch (error) {
    console.error("Error saving job:", error);

    if (error.response?.status === 401) {
      alert("Please login to save jobs.");
    } else {
      alert("Unable to save job.");
    }
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-bg-orb jobs-orb-one"></div>
        <div className="jobs-bg-orb jobs-orb-two"></div>

        <div className="jobs-loading-state">
          <div className="jobs-loading-icon">
            <span className="jobs-loading-spinner"></span>
          </div>

          <h2>Finding opportunities...</h2>

          <p>
            Loading the latest jobs from HireSphere.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="jobs-page">
        <div className="jobs-bg-orb jobs-orb-one"></div>

        <div className="jobs-error-state">
          <div className="jobs-error-icon">!</div>

          <span className="jobs-error-label">
            CONNECTION ERROR
          </span>

          <h2>{error}</h2>

          <p>
            Please make sure your Django backend is
            running and try again.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="jobs-page">

      {/* BACKGROUND */}

      <div className="jobs-bg-orb jobs-orb-one"></div>
      <div className="jobs-bg-orb jobs-orb-two"></div>
      <div className="jobs-bg-grid"></div>

      <main className="jobs-container">

        {/* =====================================
            HERO
        ====================================== */}

        <section className="jobs-hero">

          <div className="jobs-eyebrow">
            <span className="jobs-eyebrow-dot"></span>
            EXPLORE OPPORTUNITIES
          </div>

          <h1>
            Find your next
            <span className="jobs-gradient-text">
              {" "}big move.
            </span>
          </h1>

          <p>
            Discover jobs that match your skills,
            experience, and ambitions. Your next
            opportunity could be one search away.
          </p>

          <div className="jobs-hero-stats">

            <div className="hero-stat">
              <strong>{jobs.length}</strong>
              <span>Open roles</span>
            </div>

            <div className="hero-stat-divider"></div>

            <div className="hero-stat">
              <strong>AI</strong>
              <span>Powered matching</span>
            </div>

            <div className="hero-stat-divider"></div>

            <div className="hero-stat">
              <strong>24/7</strong>
              <span>Career access</span>
            </div>

          </div>

        </section>

        {/* =====================================
            SEARCH / FILTERS
        ====================================== */}

        <section className="jobs-search-panel">

          <div className="jobs-search-heading">

            <div className="search-heading-icon">
              ✦
            </div>

            <div>
              <span>SMART SEARCH</span>
              <h2>What are you looking for?</h2>
            </div>

          </div>

          <div className="job-filters">

            {/* SEARCH */}

            <div className="job-filter-field search-field">

              <label htmlFor="job-search">
                SEARCH
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ⌕
                </span>

                <input
                  id="job-search"
                  type="text"
                  placeholder="Job title, skill or company..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            {/* LOCATION */}

            <div className="job-filter-field">

              <label htmlFor="job-location">
                LOCATION
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ⌖
                </span>

                <input
                  id="job-location"
                  type="text"
                  placeholder="City or location..."
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />

              </div>

            </div>

            {/* JOB TYPE */}

            <div className="job-filter-field">

              <label htmlFor="job-type">
                JOB TYPE
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ◉
                </span>

                <select
                  id="job-type"
                  value={jobType}
                  onChange={(e) =>
                    setJobType(e.target.value)
                  }
                >

                  <option value="">
                    All Job Types
                  </option>

                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>

                </select>

              </div>

            </div>

            {/* SKILLS */}

            <div className="job-filter-field">

              <label htmlFor="job-skills">
                SKILLS
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ◆
                </span>

                <input
                  id="job-skills"
                  type="text"
                  placeholder="Python, React, SQL..."
                  value={skills}
                  onChange={(e) =>
                    setSkills(e.target.value)
                  }
                />

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="job-filter-field">

              <label htmlFor="job-experience">
                EXPERIENCE
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ◈
                </span>

                <select
                  id="job-experience"
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                >

                  <option value="">
                    All Experience
                  </option>

                  <option value="FRESHER">
                    Fresher
                  </option>

                  <option value="JUNIOR">
                    Junior
                  </option>

                  <option value="MID">
                    Mid Level
                  </option>

                  <option value="SENIOR">
                    Senior
                  </option>

                </select>

              </div>

            </div>

            {/* MIN SALARY */}

            <div className="job-filter-field">

              <label htmlFor="min-salary">
                MIN SALARY
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ₹
                </span>

                <input
                  id="min-salary"
                  type="number"
                  placeholder="e.g. 500000"
                  value={minSalary}
                  onChange={(e) =>
                    setMinSalary(e.target.value)
                  }
                />

              </div>

            </div>

            {/* MAX SALARY */}

            <div className="job-filter-field">

              <label htmlFor="max-salary">
                MAX SALARY
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ₹
                </span>

                <input
                  id="max-salary"
                  type="number"
                  placeholder="e.g. 1000000"
                  value={maxSalary}
                  onChange={(e) =>
                    setMaxSalary(e.target.value)
                  }
                />

              </div>

            </div>

            {/* WORK MODE */}

            <div className="job-filter-field">

              <label htmlFor="remote">
                WORK MODE
              </label>

              <div className="job-input-wrapper">

                <span className="job-input-icon">
                  ◉
                </span>

                <select
                  id="remote"
                  value={remote}
                  onChange={(e) =>
                    setRemote(e.target.value)
                  }
                >

                  <option value="">
                    All Work Modes
                  </option>

                  <option value="true">
                    Remote
                  </option>

                  <option value="false">
                    On-site
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* SEARCH BUTTON */}

          <button
            type="button"
            className="search-jobs-btn"
            onClick={() =>
              fetchJobs({
                keyword: search,
                location,
                jobType,
                skills,
                experience,
                minSalary,
                maxSalary,
                remote,
              })
            }
          >
            🔎 Search Jobs
          </button>

          {/* ACTIVE FILTERS */}

          {(search ||
            location ||
            jobType ||
            skills ||
            experience ||
            minSalary ||
            maxSalary ||
            remote) && (

            <div className="active-filters">

              <span className="active-filter-label">
                Active filters:
              </span>

              {search && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setSearch("")}
                >
                  {search}
                  <span>×</span>
                </button>
              )}

              {location && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setLocation("")}
                >
                  {location}
                  <span>×</span>
                </button>
              )}

              {jobType && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setJobType("")}
                >
                  {jobType}
                  <span>×</span>
                </button>
              )}

              {skills && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setSkills("")}
                >
                  {skills}
                  <span>×</span>
                </button>
              )}

              {experience && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setExperience("")}
                >
                  {experience}
                  <span>×</span>
                </button>
              )}

              {minSalary && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setMinSalary("")}
                >
                  Min ₹{Number(minSalary).toLocaleString("en-IN")}
                  <span>×</span>
                </button>
              )}

              {maxSalary && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setMaxSalary("")}
                >
                  Max ₹{Number(maxSalary).toLocaleString("en-IN")}
                  <span>×</span>
                </button>
              )}

              {remote && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setRemote("")}
                >
                  {remote === "true"
                    ? "Remote"
                    : "On-site"}
                  <span>×</span>
                </button>
              )}

              <button
                type="button"
                className="clear-all-btn"
                onClick={clearFilters}
              >
                Clear all
              </button>

            </div>
          )}

        </section>

        {/* =====================================
            RESULTS HEADER
        ====================================== */}

        <section className="jobs-results-header">

          <div>

            <span className="results-kicker">
              AVAILABLE OPPORTUNITIES
            </span>

            <h2>
              Latest job openings
            </h2>

          </div>

          <div className="job-count">

            <span className="job-count-number">
              {filteredJobs.length}
            </span>

            <span>
              {filteredJobs.length === 1
                ? "opportunity"
                : "opportunities"}
            </span>

          </div>

        </section>

        {/* =====================================
            NO JOBS
        ====================================== */}

        {filteredJobs.length === 0 ? (

          <div className="no-jobs">

            <div className="no-jobs-icon">
              ⌕
            </div>

            <span className="no-jobs-kicker">
              NO MATCHES
            </span>

            <h2>
              No jobs found
            </h2>

            <p>
              We couldn't find opportunities matching
              your current search. Try changing your
              filters or search terms.
            </p>

            <button
              type="button"
              className="reset-search-btn"
              onClick={clearFilters}
            >
              Reset Search
            </button>

          </div>

        ) : (

          /* =====================================
             JOB GRID
          ====================================== */

          <div className="jobs-grid">

            {filteredJobs.map((job, index) => (

              <article
                className="job-card"
                key={job.id}
              >

                <div className="job-card-glow"></div>

                {/* CARD HEADER */}

                <div className="job-card-header">

                  <div className="job-company-avatar">
                    {job.company_name
                      ?.charAt(0)
                      .toUpperCase() || "J"}
                  </div>

                  <div className="job-card-title-area">

                    <div className="job-card-topline">

                      <span className="job-open-badge">
                        <span></span>
                        OPEN
                      </span>

                      {index < 3 && (
                        <span className="job-featured-badge">
                          ✦ FEATURED
                        </span>
                      )}

                    </div>

                    <h2>
                      {job.title}
                    </h2>

                    <p className="job-company">
                      {job.company_name}
                    </p>

                  </div>

                </div>

                {/* JOB TYPE */}

                <div className="job-type-row">

                  <span className="job-type">
                    {job.job_type}
                  </span>

                  {job.remote && (
                    <span className="remote-badge">
                      ◉ Remote
                    </span>
                  )}

                </div>

                {/* INFO */}

                <div className="job-info">

                  <div className="job-info-item">

                    <span className="job-info-icon">
                      ⌖
                    </span>

                    <div>
                      <small>LOCATION</small>
                      <p>
                        {job.location || "Not specified"}
                      </p>
                    </div>

                  </div>

                  <div className="job-info-item">

                    <span className="job-info-icon salary-icon">
                      ₹
                    </span>

                    <div>
                      <small>SALARY</small>
                      <p>
                        {job.salary
                          ? `₹${Number(
                              job.salary
                            ).toLocaleString("en-IN")}`
                          : "Not specified"}
                      </p>
                    </div>

                  </div>

                  <div className="job-info-item">

                    <span className="job-info-icon">
                      ◆
                    </span>

                    <div>
                      <small>EXPERIENCE</small>
                      <p>
                        {job.experience_level ||
                          "Not specified"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="job-description-wrapper">

                  <span>
                    ABOUT THE ROLE
                  </span>

                  <p className="job-description">
                    {job.description}
                  </p>

                </div>

                {/* FOOTER */}

                <div className="job-card-footer">

  <button
    type="button"
    className={`save-job-btn ${
      savedJobs[job.id] ? "saved" : ""
    }`}
    onClick={() => toggleSaveJob(job.id)}
  >
    {savedJobs[job.id] ? "♥ Saved" : "♡ Save Job"}
  </button>

  <Link
    className="view-job-btn"
    to={`/jobs/${job.id}`}
  >
    <span>
      View Opportunity
    </span>

    <span className="view-job-arrow">
      →
    </span>
  </Link>

</div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Jobs;