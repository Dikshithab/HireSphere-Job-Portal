import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Prevent extremely long messages
    if (userMessage.length > 1000) {
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
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot", {
        message: userMessage,
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
          jobs: jobs,
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
    // Enter sends the message
    // Shift + Enter allows a new line
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

  // Open job details page
  const viewJob = (jobId) => {
    navigate(`/job/${jobId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open HireSphere AI"
          style={{
            position: "fixed",
            right: "25px",
            bottom: "25px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "25px",
            cursor: "pointer",
            zIndex: 1000,
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            transition: "transform 0.2s ease",
          }}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "25px",
            bottom: "25px",
            width: "390px",
            maxWidth: "calc(100vw - 30px)",
            height: "560px",
            maxHeight: "calc(100vh - 50px)",
            background: "white",
            borderRadius: "15px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "15px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
              >
                🤖 HireSphere AI
              </div>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.85,
                  marginTop: "2px",
                }}
              >
                Your career assistant
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {/* Clear Chat */}
              <button
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "17px",
                  cursor: "pointer",
                  padding: "5px",
                }}
              >
                🗑️
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                aria-label="Minimize chatbot"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                  lineHeight: "1",
                  padding: "3px 6px",
                }}
              >
                −
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "#f8fafc",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    msg.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "15px",
                }}
              >
                {/* Message bubble */}
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.sender === "user"
                        ? "14px 14px 3px 14px"
                        : "14px 14px 14px 3px",
                    background:
                      msg.sender === "user"
                        ? "#2563eb"
                        : "#e5e7eb",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "#111827",
                    fontSize: "14px",
                    lineHeight: "1.45",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>

                {/* Job Cards */}
                {msg.sender === "bot" &&
                  msg.jobs &&
                  msg.jobs.length > 0 && (
                    <div
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {msg.jobs.map((job) => (
                        <div
                          key={job.id}
                          style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "13px",
                            boxShadow:
                              "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          {/* Title */}
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "15px",
                              color: "#111827",
                              marginBottom: "4px",
                            }}
                          >
                            {job.title}
                          </div>

                          {/* Company */}
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              marginBottom: "8px",
                            }}
                          >
                            🏢 {job.companyName}
                          </div>

                          {/* Job information */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              fontSize: "12px",
                              color: "#4b5563",
                              marginBottom: "10px",
                            }}
                          >
                            <div>
                              📍 {job.location || "Location not specified"}
                            </div>

                            <div>
                              💼 {job.jobType || "Job type not specified"}
                            </div>

                            <div>
                              🧑‍💻{" "}
                              {job.experienceLevel ||
                                "Experience not specified"}
                            </div>

                            <div>
                              💰{" "}
                              {job.salary != null
                                ? `₹${Number(
                                    job.salary
                                  ).toLocaleString("en-IN")}`
                                : "Salary not specified"}
                            </div>

                            <div>
                              🌐{" "}
                              {job.remote
                                ? "Remote"
                                : "On-site"}
                            </div>
                          </div>

                          {/* View Job */}
                          <button
                            onClick={() => viewJob(job.id)}
                            style={{
                              width: "100%",
                              border: "none",
                              borderRadius: "8px",
                              padding: "9px",
                              background: "#2563eb",
                              color: "white",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            View Job →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    background: "#e5e7eb",
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 3px",
                    color: "#555",
                    fontSize: "13px",
                  }}
                >
                  <span>HireSphere AI is typing</span>
                  <span> •••</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              gap: "8px",
              background: "white",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask HireSphere AI..."
              maxLength={1000}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
                fontSize: "14px",
                minWidth: 0,
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              aria-label="Send message"
              style={{
                width: "45px",
                border: "none",
                borderRadius: "8px",
                background:
                  loading || !message.trim()
                    ? "#9ca3af"
                    : "#2563eb",
                color: "white",
                cursor:
                  loading || !message.trim()
                    ? "not-allowed"
                    : "pointer",
                fontSize: "18px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;