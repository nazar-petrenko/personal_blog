import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTranslation } from "react-i18next";

const RegisterForm = ({ close }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const api = useApi();
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!email.includes("@")) {
        alert(t("registerWindow.invalidEmail"));
        return;
      }
      if (password.length < 8 || !/[A-Z]/.test(password)) {
        alert(t("registerWindow.invalidPassword"));
        return;
      }
      if (nickname.length < 3) {
        alert(t("registerWindow.invalidNickname"));
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
      <h2>{t("registerWindow.title")}</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="email"
          placeholder={t("registerWindow.email")}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("registerWindow.nickname")}
          value={nickname}
          required
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("registerWindow.password")}
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{t("registerWindow.submit")}</button>
        <button type="button" onClick={close} className="cancel-btn">
          {t("registerWindow.cancel")}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
