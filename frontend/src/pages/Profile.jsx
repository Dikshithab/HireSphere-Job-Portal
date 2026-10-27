import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Trash2,
  ShieldCheck,
  Save,
  X
} from "lucide-react";
import api from "../services/api";
import "../css/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/users/profile/");
      const user = response.data;

      setProfile(user);
      setFullName(user.name || "");
      setPhone(user.phone || "");
    } catch (error) {
      console.error("Profile loading error:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put("/users/profile/", {
        name: fullName.trim(),
        phone: phone.trim(),
      });

      const updatedProfile = response.data;
      setProfile(updatedProfile);
      setFullName(updatedProfile.name || "");
      setPhone(updatedProfile.phone || "");

      localStorage.setItem("fullName", updatedProfile.name || "");
      window.dispatchEvent(new Event("profileUpdated"));

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");
    setFullName(profile?.name || "");
    setPhone(profile?.phone || "");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await api.delete("/users/profile/delete/");
      localStorage.clear();
      alert("Your account has been deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to delete account."
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-loading-icon">
            <User size={32} />
          </div>
          <h2>Loading profile...</h2>
          <p>Retrieving your account details.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Unable to load profile</h2>
          <p>{error || "Something went wrong."}</p>
          <button onClick={() => navigate("/jobs")}>
            Go Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile.name?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const isEmployer = profile.role === "EMPLOYER";

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* HEADER */}
        <div className="profile-header">
          <div>
            <p className="profile-label">ACCOUNT SETTINGS</p>
            <h1>My Profile</h1>
            <p>Manage your account credentials, preferences, and personal details.</p>
          </div>

          <button className="profile-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>

        {/* FEEDBACK NOTICES */}
        {message && (
          <div className="profile-success">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="profile-error-message">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* MAIN PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-card-top">
            <div className="profile-avatar">{initial}</div>

            <div className="profile-heading">
              <h2>{displayName}</h2>
              <span className="profile-role">
                {isEmployer ? "Employer Account" : "Job Seeker Account"}
              </span>
            </div>
          </div>

          {/* VIEW MODE */}
          {!editing ? (
            <div className="profile-details">
              <div className="profile-detail">
                <span className="detail-icon">
                  <User size={16} />
                </span>
                <div>
                  <small>Full Name</small>
                  <strong>{displayName}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <span className="detail-icon">
                  <Mail size={16} />
                </span>
                <div>
                  <small>Email Address</small>
                  <strong>{profile.email || "Not provided"}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <span className="detail-icon">
                  <Phone size={16} />
                </span>
                <div>
                  <small>Phone Number</small>
                  <strong>{profile.phone || "Not provided"}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <span className="detail-icon">
                  <Briefcase size={16} />
                </span>
                <div>
                  <small>Account Type</small>
                  <strong>{isEmployer ? "Employer" : "Job Seeker"}</strong>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form className="profile-edit-form" onSubmit={handleUpdate}>
              <div className="profile-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                />
                <small>Email address cannot be changed.</small>
              </div>

              <div className="profile-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="profile-edit-actions">
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  <Save size={15} />
                  <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                </button>

                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={15} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}

          {/* ACTIONS */}
          {!editing && (
            <div className="profile-actions">
              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => {
                  setMessage("");
                  setError("");
                  setFullName(profile.name || "");
                  setPhone(profile.phone || "");
                  setEditing(true);
                }}
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                className="delete-profile-btn"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>

        {/* SECURITY INFO CARD */}
        <div className="profile-info-card">
          <div className="info-card-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3>Account & Session Security</h3>
            <p>
              Your account credentials and JWT tokens are securely stored and encrypted in accordance with industry security best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;