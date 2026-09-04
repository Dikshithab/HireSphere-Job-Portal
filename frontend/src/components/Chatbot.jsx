import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I'm HireSphere AI. How can I help you today?",
      jobs: [],
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const sendMessage = async (customMessage = null) => {
    const text = (customMessage ?? message).trim();

    if (!text || loading) return;

    if (text.length > 1000) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Please keep your message under 1000 characters.",
          jobs: [],
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot", {
        message: text,
      });

      const botResponse =
        response.data?.response ||
        "Sorry, I couldn't generate a response.";

      const jobs = response.data?.jobs || [];

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          jobs,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm unable to respond right now. Please try again.",
          jobs: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! 👋 I'm HireSphere AI. How can I help you today?",
        jobs: [],
      },
    ]);
  };

  const viewJob = (jobId) => {
    navigate(`/job/${jobId}`);
    setIsOpen(false);
  };

  const suggestions = [
    "Find Java developer jobs",
    "How can I improve my resume?",
    "Give me interview tips",
  ];

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open HireSphere AI"
        >
          <span className="chatbot-fab-icon">✦</span>
          <span className="chatbot-fab-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                ✦
                <span className="online-dot" />
              </div>

              <div>
                <div className="chatbot-title">
                  HireSphere AI
                </div>

                <div className="chatbot-status">
                  <span>Online</span>
                  <span className="status-separator">•</span>
                  <span>Career Assistant</span>
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                className="chatbot-icon-btn"
                onClick={clearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                🗑
              </button>

              <button
                className="chatbot-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize"
                aria-label="Minimize chatbot"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 1 && (
              <div className="chatbot-welcome">
                <div className="welcome-icon">✦</div>

                <h3>How can I help you?</h3>

                <p>
                  Ask me about jobs, resumes, interviews,
                  skills, or your career.
                </p>

                <div className="suggestion-list">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className="suggestion-btn"
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading}
                    >
                      <span>{suggestion}</span>
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${
                  msg.sender === "user"
                    ? "user-row"
                    : "bot-row"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="message-avatar">✦</div>
                )}

                <div className="message-content">
                  <div
                    className={`message-bubble ${
                      msg.sender === "user"
                        ? "user-bubble"
                        : "bot-bubble"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "bot" &&
                    msg.jobs &&
                    msg.jobs.length > 0 && (
                      <div className="job-list">
                        {msg.jobs.map((job) => (
                          <div
                            className="chat-job-card"
                            key={job.id}
                          >
                            <div className="job-card-top">
                              <div className="job-card-title">
                                {job.title}
                              </div>

                              <span className="job-badge">
                                JOB
                              </span>
                            </div>

                            <div className="job-company">
                              🏢 {job.companyName}
                            </div>

                            <div className="job-details">
                              <span>
                                📍{" "}
                                {job.location ||
                                  "Location not specified"}
                              </span>

                              <span>
                                💼{" "}
                                {job.jobType ||
                                  "Job type not specified"}
                              </span>

                              <span>
                                🧑‍💻{" "}
                                {job.experienceLevel ||
                                  "Experience not specified"}
                              </span>

                              <span>
                                💰{" "}
                                {job.salary != null
                                  ? `₹${Number(
                                      job.salary
                                    ).toLocaleString("en-IN")}`
                                  : "Salary not specified"}
                              </span>

                              <span>
                                🌐{" "}
                                {job.remote
                                  ? "Remote"
                                  : "On-site"}
                              </span>
                            </div>

                            <button
                              className="view-job-btn"
                              onClick={() =>
                                viewJob(job.id)
                              }
                            >
                              View Job
                              <span>→</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot-row">
                <div className="message-avatar">✦</div>

                <div className="typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask HireSphere AI..."
                maxLength={1000}
                disabled={loading}
              />

              <span className="character-count">
                {message.length}/1000
              </span>
            </div>

            <button
              className={`send-btn ${
                loading || !message.trim()
                  ? "send-disabled"
                  : ""
              }`}
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              aria-label="Send message"
            >
              {loading ? "..." : "➤"}
            </button>
          </div>

          <div className="chatbot-footer">
            <span>✦</span> Powered by HireSphere AI
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;