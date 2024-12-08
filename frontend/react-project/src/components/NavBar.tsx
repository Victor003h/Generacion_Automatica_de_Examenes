import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Exámenes</h2>
      <div className="navbar-links">
        <Link to="/dashboard">Inicio</Link>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
