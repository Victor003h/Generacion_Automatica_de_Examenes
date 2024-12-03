import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo">Generación de Exámenes</h1>
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
              Como profesor, califica tus estudiantes de manera organizada.¡Te
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
        <h2 className="main-title">Bienvenido a Generación de Exámenes</h2>
        <p className="main-description">
          Una aplicación web de nuestra institución educativa para la gestión
          eficiente de exámenes y calificaciones. Nunca profesores y estudiantes
          han estado tan unidos.
        </p>
        <div className="button-group">
          <Link to="/login" className="cta-button">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="cta-button">
            Registrarse
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
