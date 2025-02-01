import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/DashboardContent/Dropdown.css";

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    alert("Cerrar Sesión");
    // Aquí puedes agregar la lógica para cerrar sesión
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Mi Cuenta <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
      </button>
      <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        <Link to="manage-account-teacher">Gestionar Cuenta</Link>
        <button onClick={handleSignOut} className="dropdown-item">
          Cerrar Sesión
        </button>
        <Link to="personalize">Personalizar</Link>
      </div>
    </div>
  );
};

export default Dropdown;
