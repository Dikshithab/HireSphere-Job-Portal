import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "JOB_SEEKER",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/users/register",
        formData
      );

      console.log("Register Response:", response.data);

      setMessage("Registration successful!");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "JOB_SEEKER",
      });

      // Redirect to login after registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Register Error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
          "Registration failed"
        );
      } else {
        setMessage("Cannot connect to server");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-page">

    <div className="auth-card">

      <h1>Create Account</h1>

      <p className="auth-subtitle">
        Join JobPortal today
      </p>

      <form onSubmit={handleRegister}>

        <div className="auth-group">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="auth-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="auth-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="auth-group">
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="auth-group">
          <label>Account Type</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="JOB_SEEKER">
              Job Seeker
            </option>

            <option value="EMPLOYER">
              Employer
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

    </div>

  </div>
);
}

export default Register;
