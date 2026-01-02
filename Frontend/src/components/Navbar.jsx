import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* Fancy Title */}
      <h2 style={styles.title}>
        Campus<span style={{ color: "#38bdf8" }}>Fix</span>
      </h2>

      <div style={styles.actions}>
        {!user && (
          <>
            <Link to="/login" style={styles.outlineBtn}>
              Login
            </Link>
            <Link to="/register" style={styles.filledBtn}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {user.role === "student" && (
              <Link to="/student" style={styles.linkBtn}>
                Dashboard
              </Link>
            )}
            {user.role === "admin" && (
              <Link to="/admin" style={styles.linkBtn}>
                Admin
              </Link>
            )}
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "#020617",
    color: "#fff",
  },
  title: {
    fontWeight: "700",
    letterSpacing: "1px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  filledBtn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "500",
  },
  outlineBtn: {
    padding: "8px 16px",
    border: "1px solid #2563eb",
    color: "#2563eb",
    borderRadius: "6px",
    fontWeight: "500",
  },
  linkBtn: {
    color: "#e5e7eb",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#dc2626",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Navbar;
