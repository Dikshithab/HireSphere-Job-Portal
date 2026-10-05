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

  /* =====================================================
     AUTO SCROLL
     ===================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* =====================================================
     AUTO FOCUS
     ===================================================== */

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  /* =====================================================
     SEND MESSAGE
     ===================================================== */

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

    /* Add user message */

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
        jobs: [],
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot/", {
        message: text,
      });

      const botResponse =
        response.data?.reply ||
        response.data?.response ||
        response.data?.message ||
        "Sorry, I couldn't generate a response.";

      const jobs = Array.isArray(response.data?.jobs)
        ? response.data.jobs
        : [];

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          jobs,
        },
      ]);
    } catch (error) {
      console.error(
        "Chatbot error:",
        error.response?.data || error
      );

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

  /* =====================================================
     ENTER KEY
     ===================================================== */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* =====================================================
     CLEAR CHAT
     ===================================================== */

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! 👋 I'm HireSphere AI. How can I help you today?",
        jobs: [],
      },
    ]);
  };

  /* =====================================================
     VIEW JOB
     ===================================================== */

  const viewJob = (jobId) => {
  navigate(`/jobs/${jobId}`);
  setIsOpen(false);
};

  /* =====================================================
     AI SUGGESTIONS
     ===================================================== */

  const suggestions = [
    {
      icon: "⌕",
      text: "Find Java developer jobs",
    },
    {
      icon: "✦",
      text: "How can I improve my resume?",
    },
    {
      icon: "◉",
      text: "Give me interview tips",
    },
  ];

  return (
    <>
      {/* =================================================
          FLOATING AI BUTTON
          ================================================= */}

      {!isOpen && (
        <button
          type="button"
          className="chatbot-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open HireSphere AI"
          title="Ask HireSphere AI"
        >
          <span className="chatbot-fab-glow" />

          <span className="chatbot-fab-icon">
            ✦
          </span>

          <span className="chatbot-fab-pulse" />

          <span className="chatbot-fab-label">
            AI
          </span>
        </button>
      )}


      {/* =================================================
          CHAT WINDOW
          ================================================= */}

      {isOpen && (
        <div className="chatbot-window">

          {/* =================================================
              HEADER
              ================================================= */}

          <header className="chatbot-header">

            <div className="chatbot-header-left">

              <div className="chatbot-avatar">
                <span>✦</span>
                <span className="online-dot" />
              </div>

              <div className="chatbot-heading">

                <div className="chatbot-title">
                  HireSphere AI
                </div>

                <div className="chatbot-status">
                  <span className="status-live-dot" />
                  <span>Online</span>

                  <span className="status-separator">
                    •
                  </span>

                  <span>Career Assistant</span>
                </div>

              </div>

            </div>


            {/* HEADER ACTIONS */}

            <div className="chatbot-header-actions">

              <button
                type="button"
                className="chatbot-icon-btn"
                onClick={clearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <span>⌫</span>
              </button>

              <button
                type="button"
                className="chatbot-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize chatbot"
                aria-label="Minimize chatbot"
              >
                ×
              </button>

            </div>

          </header>


          {/* =================================================
              MESSAGES
              ================================================= */}

          <main className="chatbot-messages">

            {/* WELCOME STATE */}

            {messages.length === 1 && (
              <div className="chatbot-welcome">

                <div className="welcome-icon-wrapper">
                  <div className="welcome-icon">
                    ✦
                  </div>
                </div>

                <div className="welcome-badge">
                  <span>✦</span>
                  AI CAREER ASSISTANT
                </div>

                <h3>
                  How can I help you?
                </h3>

                <p>
                  Ask me about jobs, resumes,
                  interviews, skills, or your career.
                </p>


                {/* SUGGESTIONS */}

                <div className="suggestion-list">

                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion.text}
                      className="suggestion-btn"
                      onClick={() =>
                        sendMessage(suggestion.text)
                      }
                      disabled={loading}
                    >

                      <span className="suggestion-left">

                        <span className="suggestion-icon">
                          {suggestion.icon}
                        </span>

                        <span>
                          {suggestion.text}
                        </span>

                      </span>

                      <span className="suggestion-arrow">
                        →
                      </span>

                    </button>
                  ))}

                </div>

              </div>
            )}


            {/* MESSAGE LIST */}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${
                  msg.sender === "user"
                    ? "user-row"
                    : "bot-row"
                }`}
              >

                {/* BOT AVATAR */}

                {msg.sender === "bot" && (
                  <div
                    className="message-avatar"
                    aria-hidden="true"
                  >
                    ✦
                  </div>
                )}


                <div className="message-content">

                  {/* MESSAGE BUBBLE */}

                  <div
                    className={`message-bubble ${
                      msg.sender === "user"
                        ? "user-bubble"
                        : "bot-bubble"
                    }`}
                  >
                    {msg.text}
                  </div>


                  {/* =================================================
                      JOB RECOMMENDATIONS
                      ================================================= */}

                  {msg.sender === "bot" &&
                    msg.jobs?.length > 0 && (

                    <div className="job-list">

                      <div className="job-list-heading">
                        <span>✦</span>
                        Recommended opportunities
                      </div>

                      {msg.jobs.map((job) => {

                        const companyName =
                          job.companyName ??
                          job.company_name ??
                          "Company";

                        const jobType =
                          job.jobType ??
                          job.job_type ??
                          "Job type not specified";

                        const experienceLevel =
                          job.experienceLevel ??
                          job.experience_level ??
                          "Experience not specified";

                        return (
                          <article
                            className="chat-job-card"
                            key={job.id}
                          >

                            {/* JOB HEADER */}

                            <div className="job-card-top">

                              <div>
                                <div className="job-card-title">
                                  {job.title}
                                </div>

                                <div className="job-company">
                                  <span className="company-icon">
                                    ◈
                                  </span>

                                  {companyName}
                                </div>
                              </div>

                              <span className="job-badge">
                                JOB
                              </span>

                            </div>


                            {/* JOB DETAILS */}

                            <div className="job-details">

                              <span>
                                <b>⌖</b>
                                {job.location ||
                                  "Location not specified"}
                              </span>

                              <span>
                                <b>◫</b>
                                {jobType}
                              </span>

                              <span>
                                <b>◉</b>
                                {experienceLevel}
                              </span>

                              <span>
                                <b>₹</b>

                                {job.salary != null
                                  ? `₹${Number(
                                      job.salary
                                    ).toLocaleString("en-IN")}`
                                  : "Salary not specified"}
                              </span>

                              <span>
                                <b>◌</b>

                                {job.remote
                                  ? "Remote"
                                  : "On-site"}
                              </span>

                            </div>


                            {/* VIEW JOB */}

                            <button
                              type="button"
                              className="view-job-btn"
                              onClick={() =>
                                viewJob(job.id)
                              }
                            >
                              <span>
                                View Job
                              </span>

                              <span>
                                →
                              </span>
                            </button>

                          </article>
                        );
                      })}

                    </div>
                  )}

                </div>

              </div>
            ))}


            {/* =================================================
                TYPING INDICATOR
                ================================================= */}

            {loading && (
              <div className="message-row bot-row">

                <div
                  className="message-avatar"
                  aria-hidden="true"
                >
                  ✦
                </div>

                <div className="typing-bubble">

                  <span />
                  <span />
                  <span />

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </main>


          {/* =================================================
              INPUT
              ================================================= */}

          <div className="chatbot-input-area">

            <div className="chatbot-input-wrapper">

              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask HireSphere AI anything..."
                maxLength={1000}
                disabled={loading}
                aria-label="Message HireSphere AI"
              />

              <span className="character-count">
                {message.length}/1000
              </span>

            </div>


            {/* SEND */}

            <button
              type="button"
              className={`send-btn ${
                loading || !message.trim()
                  ? "send-disabled"
                  : ""
              }`}
              onClick={() => sendMessage()}
              disabled={
                loading || !message.trim()
              }
              aria-label="Send message"
              title="Send message"
            >
              {loading ? (
                <span className="send-loading">
                  •••
                </span>
              ) : (
                <span>➤</span>
              )}
            </button>

          </div>


          {/* =================================================
              FOOTER
              ================================================= */}

          <footer className="chatbot-footer">

            <span className="footer-ai-icon">
              ✦
            </span>

            <span>
              Powered by HireSphere AI
            </span>

            <span className="footer-dot">
              •
            </span>

            <span>
              Career intelligence
            </span>

          </footer>

        </div>
      )}
    </>
  );
}

export default Chatbot;