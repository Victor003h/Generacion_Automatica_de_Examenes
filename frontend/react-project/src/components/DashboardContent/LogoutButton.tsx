import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../../styles/DashboardContent/LogoutButton.css";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar las credenciales del usuario (esto es solo un ejemplo, ajusta según tu lógica de autenticación)
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");
    // Redireccionar a la página de inicio
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      <FaSignOutAlt /> Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
