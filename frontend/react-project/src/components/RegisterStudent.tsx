// Importa las librerías necesarias de React y otros módulos
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Register.css";
import "../styles/Errors.css";

// Define el componente funcional para el registro de estudiantes
const RegisterStudent: React.FC = () => {
  // Define los estados locales para los datos del formulario y la repetición de la contraseña
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    last_name: "",
    last_name2: "",
    age: 0,
    course: 2024,
  });

  const [passwordRepeat, setPasswordRepeat] = useState("");

  // Maneja el cambio en el campo de repetición de la contraseña
  const handlePasswordRepeatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordRepeat(e.target.value);
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Verifica si las contraseñas coinciden
    if (formData.password !== passwordRepeat) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const data = { ...formData };
    // Envía los datos del formulario al servidor
    axios
      .post("http://localhost:8000/api/account/register/student/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Registro exitoso:", response.data);
        // Maneja la respuesta, redirige o muestra un mensaje de éxito
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
        // Maneja el error, muestra un mensaje de error
      });
  };

  // Renderiza el formulario de registro de estudiantes
  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">¡Regístrate como Estudiante!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="first_name"
              className="form-input"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-horizontal">
            <div className="form-group-half">
              <label className="form-label">Primer Apellido</label>
              <input
                type="text"
                name="last_name"
                className="form-input"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-half">
              <label className="form-label">Segundo Apellido</label>
              <input
                type="text"
                name="last_name2"
                className="form-input"
                value={formData.last_name2}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Edad</label>
            <input
              type="number"
              name="age"
              className="form-input"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Curso</label>
            <input
              type="number"
              name="course"
              className="form-input"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
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
            <label className="form-label">Repetir Contraseña</label>
            <input
              type="password"
              name="passwordRepeat"
              className="form-input"
              value={passwordRepeat}
              onChange={handlePasswordRepeatChange}
              required
            />
          </div>
          {error && <p className="submit-error-message">{error}</p>}
          <button type="submit" className="register-button">
            Regístrate
          </button>
        </form>
        <p className="login-link">
          <a href="/">Volver a Inicio</a>
        </p>
        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
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

export default RegisterStudent;
