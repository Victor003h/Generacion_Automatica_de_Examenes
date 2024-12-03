import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";

const Register: React.FC = () => {
  const [role, setRole] = useState("");

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Regístrate</h2>
        <form>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-input" />
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
          <button type="submit" className="register-button">
            Regístrate
          </button>
        </form>
        <Link to="/" className="home-button">
          Volver a Inicio
        </Link>
        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
