import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RegisterForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", { email, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      login(payload, token);
      close(); // Закрити форму
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-popup">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        <button type="button" onClick={close} className="cancel-btn">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
