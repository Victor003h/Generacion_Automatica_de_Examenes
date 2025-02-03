// Importa las librerías necesarias de React y otros módulos
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css"; // Estilos del botón de atrás

// Define el componente funcional para el botón de atrás
const BackButton: React.FC = () => {
  const navigate = useNavigate();

  // Renderiza el botón de atrás
  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      Atrás
    </button>
  );
};

export default BackButton;
