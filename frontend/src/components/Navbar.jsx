import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import { GiHamburgerMenu } from "react-icons/gi";
import "../styles/Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-brand">
          <img src="/logo.png" alt="Logo" />
        </div>

        <GiHamburgerMenu className="burger-icon" onClick={toggleMobileMenu} />

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          {[
            { to: "/", label: t("home") },
            { to: "/who-we-are", label: t("whoWeAre") },
            { to: "/articles", label: t("articles") },
            { to: "/about-project", label: t("aboutProject") },
            { to: "/learn-more", label: t("learnMore") },
            ...(user?.role === "admin"
              ? [{ to: "/admin/add-article", label: t("addArticle") }]
              : [])
          ].map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="nav-link"
              style={{ "--i": i }}
              onClick={handleNavLinkClick}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <div className="lang-switcher">
          <button onClick={() => changeLanguage("en")}>EN</button>
          <button onClick={() => changeLanguage("nl")}>NL</button>
        </div>
        {!user ? (
          <div className="auth-buttons">
            <button className="auth-btn" onClick={toggleLogin}>{t("login")}</button>
            <button className="auth-btn" onClick={toggleRegister}>{t("register")}</button>
          </div>
        ) : (
          <button className="auth-btn" onClick={logout}>{t("logout")}</button>
        )}
      </div>

      {showLogin && <LoginForm close={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm close={() => setShowRegister(false)} />}
    </nav>
  );
}
