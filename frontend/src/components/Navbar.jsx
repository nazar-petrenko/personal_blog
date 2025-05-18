import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import { FaFacebookF, FaTwitter, FaYoutube, FaRss } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import '../assets/logo_blog.svg';
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
          <img src="../assets/logo_blog.svg" alt="Logo" />
        </div>

        <GiHamburgerMenu className="burger-icon" onClick={toggleMobileMenu} />

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={handleNavLinkClick}>{t("home")}</NavLink>
          <NavLink to="/who-we-are" className="nav-link" onClick={handleNavLinkClick}>{t("whoWeAre")}</NavLink>
          <NavLink to="/articles" className="nav-link" onClick={handleNavLinkClick}>{t("articles")}</NavLink>
          <NavLink to="/about-project" className="nav-link" onClick={handleNavLinkClick}>{t("aboutProject")}</NavLink>
          <NavLink to="/learn-more" className="nav-link" onClick={handleNavLinkClick}>{t("learnMore")}</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin/add-article" className="nav-link" onClick={handleNavLinkClick}>{t("addArticle")}</NavLink>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="lang-switcher">
          <button onClick={() => changeLanguage("en")}>EN</button>
          <button onClick={() => changeLanguage("nl")}>NL</button>
        </div>

        <div className="social-icons">
          <FaFacebookF />
          <FaTwitter />
          <FaYoutube />
          <FaRss />
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
