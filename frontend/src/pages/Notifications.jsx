import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Send,
  Inbox,
  Sparkles,
  XCircle,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  CheckCheck,
  AlertTriangle
} from "lucide-react";
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
      setNotifications(Array.isArray(response.data) ? response.data : []);
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
      await api.patch(`/notifications/${notificationId}/read/`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - notificationDate) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPLICATION_SUBMITTED":
        return <Send size={18} className="icon-submitted" />;
      case "APPLICATION_RECEIVED":
        return <Inbox size={18} className="icon-received" />;
      case "APPLICATION_SHORTLISTED":
        return <Sparkles size={18} className="icon-shortlisted" />;
      case "APPLICATION_REJECTED":
        return <XCircle size={18} className="icon-rejected" />;
      case "APPLICATION_HIRED":
        return <CheckCircle2 size={18} className="icon-hired" />;
      default:
        return <Briefcase size={18} className="icon-default" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <div className="notifications-spinner" />
          <p>Loading activity notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <span className="notifications-label">ACTIVITY CENTER</span>
          <h1>Notifications</h1>
          <p>Stay updated with application developments, status changes, and interview alerts.</p>
        </div>

        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllAsRead}>
            <CheckCheck size={15} />
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      {error && (
        <div className="notification-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {!error && notifications.length === 0 && (
        <div className="notifications-empty">
          <div className="empty-icon">
            <Bell size={32} />
          </div>

          <h2>No notifications yet</h2>
          <p>
            When employers review your submissions or applications update status, you will be notified here.
          </p>
        </div>
      )}

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${notification.is_read ? "read" : "unread"}`}
            onClick={() => !notification.is_read && markAsRead(notification.id)}
          >
            <div className="notification-icon-box">
              {getNotificationIcon(notification.notification_type)}
            </div>

            <div className="notification-content">
              <div className="notification-title-row">
                <h3>{notification.title}</h3>
                {!notification.is_read && <span className="unread-dot" />}
              </div>

              <p>{notification.message}</p>

              <div className="notification-footer-meta">
                <span className="notification-time">
                  {formatDate(notification.created_at)}
                </span>

                {notification.job_id && (
                  <Link
                    to={`/jobs/${notification.job_id}`}
                    className="notification-job-link"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span>View Role</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
