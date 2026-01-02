import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electrical",
    priority: "Low",
    image: null,
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await api.get("/complaints/my");
    setComplaints(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("priority", form.priority);
      if (form.image) data.append("image", form.image);

      await api.post("/complaints", data);

      setForm({
        title: "",
        description: "",
        category: "Electrical",
        priority: "Low",
        image: null,
      });

      setShowForm(false);
      fetchComplaints();
    } catch {
      alert("Failed to create complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.name} 👋</h2>
      <p style={styles.subtext}>
        Raise a complaint or track existing ones in real time.
      </p>

      <div style={styles.header}>
        <h3>My Complaints</h3>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Raise Complaint"}
        </button>
      </div>

      {/* Raise Complaint Form */}
      {showForm && (
        <form style={styles.formCard} onSubmit={handleSubmit}>
          <h4>Raise New Complaint</h4>

          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={styles.row}>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>Internet</option>
              <option>Classroom</option>
              <option>Other</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}

      {/* Complaint List */}
      {complaints.length === 0 && <p>No complaints raised yet.</p>}

      <div style={styles.list}>
        {complaints.map((c) => (
          <div
            key={c._id}
            style={styles.card}
            onClick={() => navigate(`/complaints/${c._id}`)}
          >
            <div>
              <h4>{c.title}</h4>
              <p style={styles.category}>{c.category}</p>
            </div>
            <span style={statusStyle(c.status)}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
  },
  subtext: {
    color: "#64748b",
    marginBottom: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  formCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "25px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  category: {
    fontSize: "13px",
    color: "#64748b",
  },
};

const statusStyle = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  background:
    status === "Resolved"
      ? "#dcfce7"
      : status === "In Progress"
      ? "#e0f2fe"
      : "#fef3c7",
  color:
    status === "Resolved"
      ? "#166534"
      : status === "In Progress"
      ? "#0369a1"
      : "#92400e",
});

export default StudentDashboard;
