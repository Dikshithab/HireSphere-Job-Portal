import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../css/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      // Store JWT
      localStorage.setItem("token", response.data.token);

      // Store role
      localStorage.setItem("role", response.data.role);

      // Store user's full name
      localStorage.setItem("fullName", response.data.fullName);

      const role = response.data.role;

      console.log("Logged in role:", role);

      if (role === "EMPLOYER") {
        navigate("/employer");
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setMessage(error.response.data?.message || "Invalid email or password");
      } else {
        setMessage("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Login</h1>

      <p className="auth-subtitle">Welcome back to JobPortal</p>

      <form onSubmit={handleLogin}>
        <div className="auth-group">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="auth-group">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
