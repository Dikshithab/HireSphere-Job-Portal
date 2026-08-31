import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/JobDetails.css";

function JobDetails() {

  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);

  const [applied, setApplied] = useState(false);

  const [applicationMessage, setApplicationMessage] =
    useState("");


  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");


  // ================================
  // LOAD JOB DETAILS
  // ================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        const response = await api.get(`/jobs/${id}`);

        console.log(
          "Job Details:",
          response.data
        );

        setJob(response.data);

      } catch (error) {

        console.error(
          "Error fetching job:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load job details."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchJob();

  }, [id]);


  // ================================
  // CHECK WHETHER ALREADY APPLIED
  // ================================

  useEffect(() => {

    const checkApplication = async () => {

      if (
        !token ||
        role !== "JOB_SEEKER"
      ) {
        return;
      }


      try {

        const response =
          await api.get("/applications/my");


        const applications =
          response.data;


        const alreadyApplied =
          applications.some(
            (application) =>
              Number(application.jobId) ===
              Number(id)
          );


        if (alreadyApplied) {

          setApplied(true);

          setApplicationMessage(
            "You have already applied for this job."
          );

        }

      } catch (error) {

        console.error(
          "Error checking application:",
          error
        );

      }

    };


    checkApplication();

  }, [id, token, role]);


  // ================================
  // APPLY FOR JOB
  // ================================

  const handleApply = async () => {

    const currentToken =
      localStorage.getItem("token");

    const currentRole =
      localStorage.getItem("role");


    // Not logged in

    if (!currentToken) {

      setApplicationMessage(
        "Please login as a job seeker to apply."
      );

      return;
    }


    // Employer trying to apply

    if (currentRole !== "JOB_SEEKER") {

      setApplicationMessage(
        "Only job seekers can apply for jobs."
      );

      return;
    }


    // Already applied

    if (applied) {

      setApplicationMessage(
        "You have already applied for this job."
      );

      return;
    }


    setApplying(true);

    setApplicationMessage("");


    try {

      const response =
        await api.post(
          "/applications",
          {
            jobId: Number(id)
          }
        );


      console.log(
        "Application submitted:",
        response.data
      );


      setApplied(true);


      setApplicationMessage(
        "Application submitted successfully! 🎉"
      );


    } catch (error) {

      console.error(
        "Application Error:",
        error
      );


      // Backend response exists

      if (error.response) {

        const backendMessage =
          error.response.data?.message ||
          error.response.data;


        setApplicationMessage(
          backendMessage ||
          "Unable to submit application."
        );


        // If backend says duplicate

        if (
          typeof backendMessage === "string" &&
          backendMessage
            .toLowerCase()
            .includes("already applied")
        ) {

          setApplied(true);

        }

      }

      // Server cannot be reached

      else {

        setApplicationMessage(
          "Cannot connect to server."
        );

      }

    } finally {

      setApplying(false);

    }

  };


  // ================================
  // LOADING
  // ================================

  if (loading) {

    return (

      <div className="job-details-page">

        <div className="job-details-message">

          <h2>
            Loading job details...
          </h2>

        </div>

      </div>

    );

  }


  // ================================
  // ERROR
  // ================================

  if (error || !job) {

    return (

      <div className="job-details-page">

        <div className="job-details-message">

          <h2>
            {error || "Job not found."}
          </h2>


          <Link
            to="/jobs"
            className="back-btn"
          >
            Back to Jobs
          </Link>

        </div>

      </div>

    );

  }


  // ================================
  // PAGE
  // ================================

  return (

    <div className="job-details-page">


      <Link
        to="/jobs"
        className="back-link"
      >
        ← Back to Jobs
      </Link>


      <div className="job-details-card">


        {/* ================= HEADER ================= */}

        <div className="job-details-header">

          <div>

            <h1>
              {job.title}
            </h1>


            <h3>
              {job.companyName}
            </h3>

          </div>


          <span className="job-details-type">

            {job.jobType}

          </span>

        </div>


        {/* ================= JOB INFORMATION ================= */}

        <div className="job-details-info">


          <div>

            <span>📍</span>

            <strong>
              Location
            </strong>

            <p>
              {job.location}
            </p>

          </div>


          <div>

            <span>💰</span>

            <strong>
              Salary
            </strong>

            <p>
              ₹
              {Number(
                job.salary
              ).toLocaleString("en-IN")}
            </p>

          </div>


          <div>

            <span>🎓</span>

            <strong>
              Experience
            </strong>

            <p>
              {job.experienceLevel}
            </p>

          </div>


        </div>


        {/* ================= DESCRIPTION ================= */}

        <section className="job-section">

          <h2>
            Job Description
          </h2>

          <p>
            {job.description}
          </p>

        </section>


        {/* ================= REQUIREMENTS ================= */}

        <section className="job-section">

          <h2>
            Requirements
          </h2>

          <p>
            {job.requirements}
          </p>

        </section>


        {/* ================= APPLY ================= */}

        <div className="job-details-actions">


          {role === "JOB_SEEKER" && token ? (

            <>

              <button
                className="apply-btn"
                onClick={handleApply}
                disabled={
                  applying ||
                  applied
                }
              >

                {applied
                  ? "Already Applied"
                  : applying
                  ? "Applying..."
                  : "Apply Now"}

              </button>


              {applicationMessage && (

                <p className="application-message">

                  {applicationMessage}

                </p>

              )}

            </>

          ) : role === "EMPLOYER" ? (

            <p className="application-message">

              Employers cannot apply for jobs.

            </p>

          ) : (

            <Link
              to="/login"
              className="apply-btn"
            >

              Login as Job Seeker to Apply

            </Link>

          )}


        </div>


      </div>

    </div>

  );

}


export default JobDetails;