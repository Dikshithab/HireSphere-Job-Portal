import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");

        console.log("Jobs received:", response.data);

        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.code === "ERR_NETWORK") {

    setError(
      "Backend server is not running. Please start Spring Boot."
    );

  } else {
        setError("Unable to load jobs.");
      } 
    }
    finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(searchText) ||
      job.companyName?.toLowerCase().includes(searchText);

    const matchesLocation =
      !location ||
      job.location
        ?.toLowerCase()
        .includes(location.toLowerCase());

    const matchesJobType =
      !jobType || job.jobType === jobType;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType
    );
  });

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-message">
          <h2>Loading jobs...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <div className="jobs-message error">
          <h2>{error}</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">

      {/* Header */}

      <div className="jobs-header">
        <h1>Find Your Dream Job</h1>

        <p>
          Discover opportunities and take the next step
          in your career.
        </p>
      </div>

      {/* Filters */}

      <div className="job-filters">

        <input
          type="text"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
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

      {/* Job Count */}

      <div className="job-count">
        <p>
          {filteredJobs.length} job
          {filteredJobs.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Jobs */}

      {filteredJobs.length === 0 ? (

        <div className="no-jobs">
          <h2>No jobs found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>

      ) : (

        <div className="jobs-grid">

          {filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <div className="job-card-header">

                <div>
                  <h2>{job.title}</h2>

                  <p className="job-company">
                    {job.companyName}
                  </p>
                </div>

                <span className="job-type">
                  {job.jobType}
                </span>

              </div>

              <div className="job-info">

                <p>
                  📍 {job.location}
                </p>

                <p>
                  💰 ₹{Number(job.salary).toLocaleString("en-IN")}
                </p>

                <p>
                  🎓 {job.experienceLevel}
                </p>

              </div>

              <p className="job-description">
                {job.description}
              </p>

              <div className="job-card-footer">

                <Link
                  className="view-job-btn"
                  to={`/jobs/${job.id}`}
                >
                  View Job
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Jobs;