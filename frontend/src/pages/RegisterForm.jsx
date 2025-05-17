import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

const RegisterForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const api = useApi(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!email.includes("@")) {
        alert("Некоректна пошта");
        return;
      }
      if (password.length < 8 || !/[A-Z]/.test(password)) {
        alert("Пароль повинен містити більше 8 символів і мінімум одну велику літеру");
        return;
      }
      if (nickname.length < 3) {
        alert("Нікнейм має містити мінімум 3 символи");
        return;
      }
      const res = await api.post("/auth/register", {
        email,
        password,
        nickname,
      });
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
          type="text"
          placeholder="Nickname"
          value={nickname}
          required
          onChange={(e) => setNickname(e.target.value)}
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
