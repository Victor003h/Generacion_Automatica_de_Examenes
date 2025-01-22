import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import useRegisterModal from "../hooks/RegisterModalTrigger";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null); // Actualiza el tipo de error
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = { ...formData, role };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/account/login/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", formData.username);
      localStorage.setItem("userId", response.data.user.id);
      console.log("Inicio de sesión exitoso:", response.data);

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Error en el inicio de sesión"
        );
        console.error(
          "Error en el inicio de sesión:",
          error.response?.data || error.message
        );
      } else {
        setError("Error inesperado");
        console.error("Error inesperado:", error);
      }
    }
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
            <label className="form-label">
              ¿Eres estudiante, profesor o administrador?
            </label>
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
              <option value="admin">Administrador</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
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
