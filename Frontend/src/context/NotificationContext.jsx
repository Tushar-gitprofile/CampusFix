import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={styles.container}>
        {notifications.map((n) => (
          <div key={n.id} style={{ ...styles.toast, ...typeStyle(n.type) }}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 9999,
  },
  toast: {
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  },
};

const typeStyle = (type) => {
  if (type === "success") return { background: "#16a34a" };
  if (type === "error") return { background: "#dc2626" };
  return { background: "#2563eb" };
};
