import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      const user = response.data;

      setProfile(user);

      setFullName(user.fullName || "");
      setPhone(user.phone || "");

    } catch (error) {

      console.error(
        "Profile loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load profile."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/users/profile",
        {
          fullName: fullName.trim(),
          phone: phone.trim()
        }
      );

      const updatedProfile = response.data;

      setProfile(updatedProfile);

      setFullName(
        updatedProfile.fullName || ""
      );

      setPhone(
        updatedProfile.phone || ""
      );


      // ========================================
      // UPDATE NAVBAR NAME
      // ========================================

      localStorage.setItem(
        "fullName",
        updatedProfile.fullName || ""
      );

      // Custom event for same browser tab
      window.dispatchEvent(
        new Event("profileUpdated")
      );


      setEditing(false);

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const handleCancel = () => {

    setEditing(false);

    setMessage("");
    setError("");

    setFullName(
      profile?.fullName || ""
    );

    setPhone(
      profile?.phone || ""
    );
  };


  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDelete = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setMessage("");

      await api.delete("/users/profile");

      // Remove all authentication/user data
      localStorage.clear();

      alert(
        "Your account has been deleted successfully."
      );

      navigate("/login");

    } catch (error) {

      console.error(
        "Delete account error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to delete account."
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="profile-page">

        <div className="profile-loading">

          <div className="profile-loading-icon">
            👤
          </div>

          <h2>
            Loading profile...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE LOAD ERROR
  // ==========================================

  if (!profile) {

    return (
      <div className="profile-page">

        <div className="profile-error">

          <h2>
            Unable to load profile
          </h2>

          <p>
            {error || "Something went wrong."}
          </p>

          <button
            onClick={() => navigate("/jobs")}
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE DATA
  // ==========================================

  const displayName =
    profile.fullName?.trim() ||
    "User";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase();

  const isEmployer =
    profile.role === "EMPLOYER";


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="profile-page">

      <div className="profile-container">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="profile-header">

          <div>

            <p className="profile-label">
              MY ACCOUNT
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal information
              and account.
            </p>

          </div>


          <button
            className="profile-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>


        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (

          <div className="profile-success">
            ✓ {message}
          </div>

        )}


        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {error && (

          <div className="profile-error-message">
            ⚠ {error}
          </div>

        )}


        {/* =====================================
            PROFILE CARD
        ====================================== */}

        <div className="profile-card">


          {/* ===================================
              PROFILE HEADER
          ==================================== */}

          <div className="profile-card-top">

            <div className="profile-avatar">
              {initial}
            </div>


            <div className="profile-heading">

              <h2>
                {displayName}
              </h2>

              <span className="profile-role">

                {isEmployer
                  ? "Employer"
                  : "Job Seeker"}

              </span>

            </div>

          </div>


          {/* ===================================
              VIEW PROFILE
          ==================================== */}

          {!editing ? (

            <div className="profile-details">


              {/* FULL NAME */}

              <div className="profile-detail">

                <span className="detail-icon">
                  👤
                </span>

                <div>

                  <small>
                    Full Name
                  </small>

                  <strong>
                    {displayName}
                  </strong>

                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-detail">

                <span className="detail-icon">
                  📧
                </span>

                <div>

                  <small>
                    Email
                  </small>

                  <strong>
                    {profile.email || "Not provided"}
                  </strong>

                </div>

              </div>


              {/* PHONE */}

              <div className="profile-detail">

                <span className="detail-icon">
                  📱
                </span>

                <div>

                  <small>
                    Phone
                  </small>

                  <strong>
                    {profile.phone || "Not provided"}
                  </strong>

                </div>

              </div>


              {/* ACCOUNT TYPE */}

              <div className="profile-detail">

                <span className="detail-icon">
                  💼
                </span>

                <div>

                  <small>
                    Account Type
                  </small>

                  <strong>

                    {isEmployer
                      ? "Employer"
                      : "Job Seeker"}

                  </strong>

                </div>

              </div>

            </div>

          ) : (


            /* =================================
               EDIT PROFILE
            ================================== */

            <form
              className="profile-edit-form"
              onSubmit={handleUpdate}
            >


              {/* FULL NAME */}

              <div className="profile-input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="profile-input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                />

                <small>
                  Email cannot be changed here.
                </small>

              </div>


              {/* PHONE */}

              <div className="profile-input-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter your phone number"
                  required
                />

              </div>


              {/* ACTION BUTTONS */}

              <div className="profile-edit-actions">

                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "💾 Save Changes"}

                </button>


                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}


          {/* =====================================
              PROFILE ACTIONS
          ====================================== */}

          {!editing && (

            <div className="profile-actions">


              {/* EDIT */}

              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => {

                  setMessage("");
                  setError("");

                  setFullName(
                    profile.fullName || ""
                  );

                  setPhone(
                    profile.phone || ""
                  );

                  setEditing(true);

                }}
              >
                ✏️ Edit Profile
              </button>


              {/* DELETE */}

              <button
                type="button"
                className="delete-profile-btn"
                onClick={handleDelete}
              >
                🗑️ Delete Account
              </button>

            </div>

          )}

        </div>


        {/* =====================================
            SECURITY CARD
        ====================================== */}

        <div className="profile-info-card">

          <div className="info-card-icon">
            🔐
          </div>

          <div>

            <h3>
              Account Security
            </h3>

            <p>
              Your account is protected by secure
              authentication.
            </p>

          </div>

        </div>


      </div>

    </div>
  );
}

export default Profile;