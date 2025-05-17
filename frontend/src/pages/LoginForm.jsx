import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      login(payload, token);
      close();
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-popup">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
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
        <button type="submit">Login</button>
        <button type="button" onClick={close} className="cancel-btn">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
