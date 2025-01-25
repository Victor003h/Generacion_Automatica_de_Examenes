import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css"; // Estilos del botón de atrás

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      Atrás
    </button>
  );
};

export default BackButton;
