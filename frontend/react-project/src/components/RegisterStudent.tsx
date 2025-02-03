import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import "../styles/Register.css";
import "../styles/Errors.css";
import { useNavigate } from "react-router-dom";
import useFetchCourses from "../hooks/useFetchCourses";

const RegisterStudent: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    last_name: "",
    last_name2: "",
    age: 0,
    course: "",
  });

  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  //const [loading, setLoading] = useState(false);
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetchCourses();

  const handlePasswordRepeatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordRepeat(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== passwordRepeat) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const data = { ...formData };
    axios
      .post("http://localhost:8000/api/account/register/student/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Registro exitoso:", response.data);
        navigate("../login");
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
            <label htmlFor="course">Curso</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(Number(e.target.value))}
              required
            >
              <option value="">Seleccionar Curso</option>
              {coursesLoading && <option>Cargando cursos...</option>}
              {coursesError && <option>Error al cargar cursos</option>}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
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
