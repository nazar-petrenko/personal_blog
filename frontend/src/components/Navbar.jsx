import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";


import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">My Blog</div>
      <div className="nav-links">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/who-we-are" className="nav-link">Who We Are</NavLink>
        <NavLink to="/about-project" className="nav-link">About Project</NavLink>
        <NavLink to="/learn-more" className="nav-link">Learn More</NavLink>
        <NavLink to="/articles" className="nav-link">Articles</NavLink>
        
        {user?.role === "admin" && (
          <NavLink to="/admin/add-article" className="nav-link">Add Article</NavLink>
        )}
        {!user ? (
          <>
            <button className="auth-btn" onClick={toggleLogin}>Login</button>
            <button className="auth-btn" onClick={toggleRegister}>Register</button>
          </>
        ) : (
          <button className="auth-btn" onClick={logout}>Logout</button>
        )}
      </div>

      {showLogin && <LoginForm close={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm close={() => setShowRegister(false)} />}
    </nav>
  );
}
