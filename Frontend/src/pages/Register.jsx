import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { ...form, role: "student" });
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <AuthCard title="Create Account">
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Create Account</button>
      </form>
    </AuthCard>
  );
};

export default Register;
