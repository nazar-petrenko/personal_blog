import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

const RegisterForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { email, password });
      const { accessToken, user } = res.data;
      login(user, accessToken);
      close();
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
