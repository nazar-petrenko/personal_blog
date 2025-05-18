import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import { FaFacebookF, FaTwitter, FaYoutube, FaRss } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import '../assets/logo_blog.svg';
import "../styles/Navbar.css";

export default function Navbar() {
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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-brand">
          <img src="../assets/logo_blog.svg" alt="Logo" />
        </div>

        <GiHamburgerMenu className="burger-icon" onClick={toggleMobileMenu} />

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/who-we-are" className="nav-link">Who we are</NavLink>
          <NavLink to="/articles" className="nav-link">Articles</NavLink>
          <NavLink to="/about-project" className="nav-link">About Project</NavLink>
          <NavLink to="/learn-more" className="nav-link">Learn More</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin/add-article" className="nav-link">Add Article</NavLink>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="social-icons">
          <FaFacebookF />
          <FaTwitter />
          <FaYoutube />
          <FaRss />
        </div>

        {!user ? (
          <div className="auth-buttons">
            <button className="auth-btn" onClick={toggleLogin}>Login</button>
            <button className="auth-btn" onClick={toggleRegister}>Register</button>
          </div>
        ) : (
          <button className="auth-btn" onClick={logout}>Logout</button>
        )}
      </div>

      {showLogin && <LoginForm close={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm close={() => setShowRegister(false)} />}
    </nav>
  );
}
