import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/MyApplication.css";

function MyApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH MY APPLICATIONS
  // ==========================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const response = await api.get(
          "/applications/my"
        );

        console.log(
          "My Applications:",
          response.data
        );

        setApplications(response.data);

      } catch (error) {

        console.error(
          "Error fetching applications:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load applications."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchApplications();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="applications-page">

        <div className="applications-header">

          <h1>My Applications</h1>

          <p>
            Loading applications...
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
      <div className="applications-page">

        <div className="applications-header">

          <h1>My Applications</h1>

          <p className="applications-error">
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <div className="applications-page">


      {/* HEADER */}

      <div className="applications-header">

        <h1>
          My Applications
        </h1>

        <p>
          Track the jobs you have applied for.
        </p>

      </div>


      {/* NO APPLICATIONS */}

      {applications.length === 0 ? (

        <div className="no-applications">

          <h2>
            No Applications Yet
          </h2>

          <p>
            You haven't applied for any jobs yet.
          </p>

          <Link
            to="/jobs"
            className="browse-jobs-btn"
          >
            Browse Jobs
          </Link>

        </div>

      ) : (


        /* APPLICATION LIST */

        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application.id}
            >


              {/* APPLICATION DETAILS */}

              <div className="application-main">

                <h2>
                  {application.jobTitle}
                </h2>

                <h3>
                  {application.companyName}
                </h3>


                <p>
                  <strong>
                    Applicant:
                  </strong>{" "}
                  {application.applicantName}
                </p>


                <p>
                  <strong>
                    Applied on:
                  </strong>{" "}

                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>

              </div>


              {/* STATUS */}

              <div className="application-status">

                <span
                  className={`status ${
                    application.status
                      ?.toLowerCase()
                  }`}
                >
                  {application.status}
                </span>


                {/* PENDING */}

                {application.status === "PENDING" && (

                  <p>
                    Your application is
                    under review.
                  </p>

                )}


                {/* SHORTLISTED */}

                {application.status === "SHORTLISTED" && (

                  <p>
                    🎉 You have been shortlisted!
                  </p>

                )}


                {/* REJECTED */}

                {application.status === "REJECTED" && (

                  <p>
                    This application was
                    not selected.
                  </p>

                )}


                {/* HIRED */}

                {application.status === "HIRED" && (

                  <p>
                    🎉 Congratulations!
                    You have been hired.
                  </p>

                )}


                {/* VIEW JOB */}

                <Link
                  to={`/jobs/${application.jobId}`}
                  className="view-application-btn"
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

export default MyApplications;