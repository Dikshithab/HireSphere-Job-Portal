
import { useState } from "react";
import api from "../services/api";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I'm HireSphere AI. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.response || response.data,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm unable to respond right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
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
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
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
            width: "360px",
            height: "500px",
            background: "white",
            borderRadius: "15px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
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
              padding: "16px",
              fontWeight: "bold",
              fontSize: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>🤖 HireSphere AI</span>

            {/* Minimize Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                lineHeight: "1",
              }}
              title="Minimize"
            >
              −
            </button>
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
                  justifyContent:
                    msg.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background:
                      msg.sender === "user"
                        ? "#2563eb"
                        : "#e5e7eb",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "#111827",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ color: "#666" }}>
                HireSphere AI is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask HireSphere AI..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
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
