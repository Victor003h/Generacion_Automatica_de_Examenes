import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Login.css";
import RegisterModal from "./Register_Modal";
import useRegisterModal from "../hooks/RegisterModalTrigger";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [role, setRole] = useState("");
  const { open, handleRegisterClick, handleCloseModal } = useRegisterModal();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { ...formData, role };
    axios
      .post("http://localhost:8000/api/account/login/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Inicio de sesión exitoso:", response.data);
        // Maneja la respuesta, guarda el token, redirige o muestra un mensaje de éxito
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión:", error.response.data);
        // Maneja el error, muestra un mensaje de error
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
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
        <p className="register-link">
          <a href="/">Volver a Inicio</a>
        </p>
        <p className="register-link">
          <span onClick={handleRegisterClick} style={{ cursor: "pointer" }}>
            ¿No tienes una cuenta? Regístrate aquí
          </span>
        </p>
      </div>
      <RegisterModal open={open} onClose={handleCloseModal} />
      <div className="side-element left-side">
        <img src="/images/auth/educ_benefits.jpg" alt="Inspiration" />
        <p>Inspírate y aprende todos los días</p>
      </div>
      <div className="side-element right-side">
        <img src="/images/auth/digital_educ.jpg" alt="Benefits" />
        <p>Descubre los beneficios de nuestra plataforma</p>
      </div>
    </div>
  );
};

export default Login;
