import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import AuthCard from "../components/AuthCard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      socket.auth = { token: res.data.token };
      socket.connect();

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthCard title="CampusFix Login">
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </AuthCard>
  );
};

export default Login;
