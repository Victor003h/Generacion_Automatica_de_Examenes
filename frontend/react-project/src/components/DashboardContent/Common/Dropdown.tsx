// Importa las librerías necesarias de React y otros módulos
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/DashboardContent/Dropdown.css";

// Define el componente funcional para el menú desplegable
const Dropdown: React.FC = () => {
  // Define el estado local para controlar la visibilidad del menú desplegable
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar la visibilidad del menú desplegable
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Función para manejar el cierre de sesión
  const handleSignOut = () => {
    alert("Cerrar Sesión");
    // Aquí puedes agregar la lógica para cerrar sesión
  };

  // Renderiza el menú desplegable
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
