import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTranslation } from "react-i18next";

const LoginForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;
      login(user, accessToken);
      close();
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login error(try to register)");
    }
  };

  return (
    <div className="auth-popup">
      <h2>{t("loginWindow.title")}</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder={t("loginWindow.email")}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("loginWindow.password")}
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{t("loginWindow.submit")}</button>
        <button type="button" onClick={close} className="cancel-btn">
          {t("loginWindow.cancel")}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
