import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/CreateJob.css";

function CreateJob() {

  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salary: "",
    experienceLevel: "FRESHER"
  });


  // Get logged-in employer's company
  useEffect(() => {

    const fetchCompany = async () => {

      try {

        const response = await api.get("/companies/my");

        console.log("My Company:", response.data);

        setCompany(response.data);

      } catch (error) {

        console.error(
          "Company error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
          "Please create your company first."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchCompany();

  }, []);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!company) {

      setMessage(
        "Please create your company first."
      );

      return;
    }

    setSaving(true);
    setMessage("");

    try {

      const response = await api.post("/jobs", {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        jobType: formData.jobType,
        salary: Number(formData.salary),
        experienceLevel: formData.experienceLevel,
        companyId: company.id
      });

      console.log(
        "Job created:",
        response.data
      );

      setMessage(
        "Job created successfully!"
      );

      setTimeout(() => {
        navigate("/employer/jobs");
      }, 1000);

    } catch (error) {

      console.error(
        "Create job error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to create job."
      );

    } finally {

      setSaving(false);

    }
  };


  if (loading) {

    return (
      <div className="create-job-page">
        <h1>Create Job</h1>
        <p>Loading company information...</p>
      </div>
    );

  }


  return (

    <div className="create-job-page">

      <h1>Create Job</h1>

      {message && (
        <p>{message}</p>
      )}

      {company && (

        <div>
          <strong>Company:</strong>{" "}
          {company.name}
        </div>

      )}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Job Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>


        <div>
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter job description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>


        <div>
          <label>Requirements</label>

          <textarea
            name="requirements"
            placeholder="Java, Spring Boot, MySQL..."
            value={formData.requirements}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>


        <div>
          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Hyderabad"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>


        <div>
          <label>Job Type</label>

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


        <div>
          <label>Salary</label>

          <input
            type="number"
            name="salary"
            placeholder="600000"
            value={formData.salary}
            onChange={handleChange}
            min="0"
            required
          />
        </div>


        <div>
          <label>Experience Level</label>

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


        <button
          type="submit"
          disabled={saving || !company}
        >
          {saving
            ? "Creating..."
            : "Create Job"}
        </button>

      </form>

    </div>

  );
}

export default CreateJob;