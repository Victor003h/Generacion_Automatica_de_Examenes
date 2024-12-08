import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Register.css";
import "../styles/Errors.css";

const Register_Professor: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    last_name: "",
    last_name2: "",
    speciality: "",
  });

  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handlePasswordRepeatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordRepeat(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== passwordRepeat) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const data = { ...formData };
    axios
      .post("http://localhost:8000/api/account/register/teacher/", data, {
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

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">¡Regístrate como Profesor!</h2>
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
            <label className="form-label">Especialidad</label>
            <input
              type="text"
              name="speciality"
              className="form-input"
              value={formData.speciality}
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
        <p className="register-link">
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

export default Register_Professor;
