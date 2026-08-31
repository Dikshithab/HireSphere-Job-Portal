import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../css/EditJob.css";

function EditJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salary: "",
    experienceLevel: "FRESHER"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  // ==========================================
  // LOAD JOB
  // ==========================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        const response = await api.get(
          `/jobs/${id}`
        );

        console.log(
          "Job:",
          response.data
        );

        const job = response.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements || "",
          location: job.location || "",
          jobType: job.jobType || "FULL_TIME",
          salary: job.salary ?? "",
          experienceLevel:
            job.experienceLevel || "FRESHER"
        });

      } catch (error) {

        console.error(
          "Error loading job:",
          error
        );

        setMessage(
          error.response?.data?.message ||
          "Unable to load job."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchJob();

  }, [id]);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // ==========================================
  // UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);
    setMessage("");

    const token =
      localStorage.getItem("token");

    try {

      const response = await api.put(
        `/jobs/${id}`,
        {
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          jobType: formData.jobType,
          salary: Number(formData.salary),
          experienceLevel:
            formData.experienceLevel
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      console.log(
        "Updated job:",
        response.data
      );

      setMessage(
        "Job updated successfully!"
      );

      setTimeout(() => {

        navigate("/employer/jobs");

      }, 1000);

    } catch (error) {

      console.error(
        "Update job error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to update job."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="edit-job-page">

        <div className="edit-job-card">

          <h1>Edit Job</h1>

          <p>
            Loading job...
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="edit-job-page">

      <div className="edit-job-card">

        <h1>
          Edit Job
        </h1>

        <p className="edit-job-subtitle">
          Update your job posting details.
        </p>


        {/* MESSAGE */}

        {message && (

          <p className="edit-job-message">
            {message}
          </p>

        )}


        <form onSubmit={handleSubmit}>


          {/* JOB TITLE */}

          <div className="form-group">

            <label>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the job"
              required
            />

          </div>


          {/* REQUIREMENTS */}

          <div className="form-group">

            <label>
              Requirements
            </label>

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
              placeholder="Enter job requirements"
              required
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hyderabad"
              required
            />

          </div>


          {/* JOB TYPE */}

          <div className="form-group">

            <label>
              Job Type
            </label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            >

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


          {/* SALARY */}

          <div className="form-group">

            <label>
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              min="0"
              placeholder="Enter salary"
              required
            />

          </div>


          {/* EXPERIENCE */}

          <div className="form-group">

            <label>
              Experience Level
            </label>

            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
            >

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


          {/* ACTIONS */}

          <div className="edit-job-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/employer/jobs")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="update-job-btn"
              disabled={saving}
            >

              {saving
                ? "Updating..."
                : "Update Job"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default EditJob;