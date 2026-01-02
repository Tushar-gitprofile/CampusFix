import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    priority: "All",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    const res = await api.get("/admin/complaints");
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/admin/complaints/${id}/status`, { status });
    fetchAllComplaints();
  };

  // 🔍 Filter + Search Logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.createdBy?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "All" || c.status === filters.status;

      const matchesCategory =
        filters.category === "All" || c.category === filters.category;

      const matchesPriority =
        filters.priority === "All" || c.priority === filters.priority;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });
  }, [complaints, search, filters]);

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p style={styles.subtext}>
        Search, filter, and manage all campus complaints.
      </p>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          placeholder="Search by title or student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option>All</option>
          <option>Electrical</option>
          <option>Plumbing</option>
          <option>Internet</option>
          <option>Classroom</option>
          <option>Other</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Complaints Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Student</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No complaints found
              </td>
            </tr>
          )}

          {filteredComplaints.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.createdBy?.name}</td>
              <td>{c.category}</td>
              <td>{c.priority}</td>
              <td>
                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c._id, e.target.value)}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </td>
              <td>
                <button onClick={() => navigate(`/complaints/${c._id}`)}>
                  Open Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "auto",
  },
  subtext: {
    color: "#64748b",
    marginBottom: "20px",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    borderCollapse: "collapse",
  },
};

export default AdminDashboard;
