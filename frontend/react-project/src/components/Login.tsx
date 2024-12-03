import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [role, setRole] = useState("");

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">¿Eres estudiante o profesor?</label>
            <select
              className="form-input"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="" disabled>
                Selecciona tu rol
              </option>
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
            </select>
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
        <Link to="/" className="home-button">
          Volver a Inicio
        </Link>
        <p className="register-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
