const AuthCard = ({ title, children }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>{title}</h2>
        <p style={styles.subtext}>Smart campus issue tracking & resolution</p>
        {children}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
  },
  card: {
    width: "360px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  heading: {
    margin: 0,
    textAlign: "center",
    fontWeight: "700",
    color: "#020617",
  },
  subtext: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "10px",
  },
};

export default AuthCard;
