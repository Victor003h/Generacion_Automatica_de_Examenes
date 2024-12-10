import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import RegisterModal from "./RegisterModal";
import useRegisterModal from "../hooks/RegisterModalTrigger";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { open, handleRegisterClick, handleCloseModal } = useRegisterModal();

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo">SmartExam</h1>
      </header>
      <div className="slider">
        <div className="slides">
          <div className="slide slide1">
            <div className="slide-text">
              Enfrenta tus exámenes de manera cómoda y eficiente.
            </div>
          </div>

          <div className="slide slide2">
            <div className="slide-text">
              Como profesor, califica tus estudiantes de manera organizada. ¡Te
              ayudaremos a planificar tu curso!
            </div>
          </div>

          <div className="slide slide3">
            <div className="slide-text">
              Ahorra tiempo para que puedas estudiar más y mejor.
            </div>
          </div>
        </div>
      </div>
      <main className="main-content">
        <h2 className="main-title">Bienvenido a SmartExam</h2>
        <p className="main-description">
          Una aplicación web de nuestra institución educativa para la gestión
          eficiente de exámenes y calificaciones. Nuestros profesores y
          estudiantes nunca han estado tan unidos.
        </p>
        <div className="button-group">
          <button className="home-button" onClick={() => navigate("/login")}>
            <div className="button-text">Iniciar Sesión</div>
          </button>
        </div>
        <div className="button-group">
          <button className="cta-button" onClick={handleRegisterClick}>
            Registrarse
          </button>
        </div>
      </main>
      <RegisterModal open={open} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
