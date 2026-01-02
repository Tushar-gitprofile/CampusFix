import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket/socket";

const STATUS_ORDER = ["Open", "In Progress", "Resolved"];

const ComplaintDetails = () => {
  const { id: complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchComplaint();
    fetchMessages();

    socket.emit("joinComplaint", { complaintId });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("statusUpdated", (data) => {
      if (data.complaintId === complaintId) {
        fetchComplaint();
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("statusUpdated");
    };
  }, [complaintId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchComplaint = async () => {
    const res = await api.get(`/complaints/${complaintId}`);
    setComplaint(res.data);
  };

  const fetchMessages = async () => {
    const res = await api.get(`/chat/complaints/${complaintId}/messages`);
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      complaintId,
      text,
    });

    setText("");
  };

  if (!complaint) return <p style={{ padding: 30 }}>Loading...</p>;

  const currentIndex = STATUS_ORDER.indexOf(complaint.status);

  return (
    <div style={styles.container}>
      {/* Complaint Info */}
      <div style={styles.infoCard}>
        <h2>{complaint.title}</h2>
        <p>{complaint.description}</p>

        {/* Status Timeline */}
        <div style={styles.timeline}>
          {STATUS_ORDER.map((status, index) => {
            const completed = index <= currentIndex;
            return (
              <div key={status} style={styles.step}>
                <div
                  style={{
                    ...styles.circle,
                    background: completed ? "#2563eb" : "#cbd5e1",
                    color: completed ? "#fff" : "#475569",
                  }}
                >
                  {index + 1}
                </div>
                <span
                  style={{
                    ...styles.label,
                    fontWeight: completed ? "600" : "400",
                  }}
                >
                  {status}
                </span>
                {index < STATUS_ORDER.length - 1 && (
                  <div
                    style={{
                      ...styles.line,
                      background: index < currentIndex ? "#2563eb" : "#cbd5e1",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {complaint.image && (
          <img src={complaint.image} alt="Complaint" style={styles.image} />
        )}
      </div>

      {/* Chat */}
      <h3 style={{ marginTop: 30 }}>💬 Discussion</h3>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user.id || msg.sender === user.id;

          return (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#2563eb" : "#e5e7eb",
                color: isMe ? "#fff" : "#000",
              }}
            >
              <small style={{ opacity: 0.8 }}>
                {isMe ? "You" : "Other"} •{" "}
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
              <div>{msg.text}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "30px",
  },
  infoCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  timeline: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  },
  step: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  circle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  label: {
    marginLeft: "8px",
    marginRight: "20px",
    fontSize: "14px",
  },
  line: {
    height: "4px",
    width: "40px",
    marginRight: "20px",
  },
  image: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  chatBox: {
    height: "380px",
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    marginBottom: "15px",
  },
  message: {
    maxWidth: "65%",
    padding: "10px 14px",
    borderRadius: "16px",
    fontSize: "14px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
  },
};

export default ComplaintDetails;
