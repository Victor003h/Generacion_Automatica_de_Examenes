// Importa las librerías necesarias de React y otros módulos
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import useRegisterModal from "./RegisterModalTrigger";

// Define el componente funcional para el inicio de sesión
const Login: React.FC = () => {
  // Define los estados locales para los datos del formulario y el error
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // Actualiza el tipo de error
  const { open, handleRegisterClick, handleCloseModal } = useRegisterModal();

  // Maneja los cambios en los campos del formulario
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/account/login/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", formData.role);
      localStorage.setItem("username", formData.username);
      localStorage.setItem("userId", response.data.user.id);
      console.log("Inicio de sesión exitoso:", response.data);

      if (formData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (formData.role === "student") {
        navigate("/student-dashboard");
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

  // Renderiza el formulario de inicio de sesión
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
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
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
