import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../css/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications/");

      setNotifications(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read/`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      window.dispatchEvent(
        new Event("notificationsUpdated")
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all/");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      window.dispatchEvent(
        new Event("notificationsUpdated")
      );
    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
    }
  };

  const formatDate = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();

    const diff = Math.floor(
      (now - notificationDate) / 1000
    );

    if (diff < 60) {
      return "Just now";
    }

    if (diff < 3600) {
      return `${Math.floor(diff / 60)} min ago`;
    }

    if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hr ago`;
    }

    if (diff < 604800) {
      return `${Math.floor(diff / 86400)} days ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <span className="notifications-label">
            ACTIVITY CENTER
          </span>

          <h1>Notifications</h1>

          <p>
            Stay updated with your applications,
            jobs, and opportunities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}

      </div>

      {error && (
        <div className="notification-error">
          {error}
        </div>
      )}

      {!error && notifications.length === 0 && (
        <div className="notifications-empty">

          <div className="empty-icon">
            🔔
          </div>

          <h2>No notifications yet</h2>

          <p>
            We'll let you know when something
            important happens.
          </p>

        </div>
      )}

      <div className="notifications-list">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`notification-card ${
              notification.is_read
                ? "read"
                : "unread"
            }`}
            onClick={() =>
              !notification.is_read &&
              markAsRead(notification.id)
            }
          >

            <div className="notification-icon-box">

              {notification.notification_type ===
              "APPLICATION_SUBMITTED"
                ? "📤"
                : notification.notification_type ===
                  "APPLICATION_RECEIVED"
                ? "📩"
                : notification.notification_type ===
                  "APPLICATION_SHORTLISTED"
                ? "⭐"
                : notification.notification_type ===
                  "APPLICATION_REJECTED"
                ? "⚠️"
                : notification.notification_type ===
                  "APPLICATION_HIRED"
                ? "🎉"
                : "💼"}

            </div>

            <div className="notification-content">

              <div className="notification-title-row">

                <h3>
                  {notification.title}
                </h3>

                {!notification.is_read && (
                  <span className="unread-dot"></span>
                )}

              </div>

              <p>
                {notification.message}
              </p>

              <span className="notification-time">
                {formatDate(notification.created_at)}
              </span>

              {notification.job_id && (
                <Link
                  to={`/jobs/${notification.job_id}`}
                  className="notification-job-link"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  View Job →
                </Link>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Notifications;
