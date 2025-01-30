import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/AddStudent.css";
import useFetchCourses from "../../../hooks/useFetchCourses";
import BackButton from "../../BackButton";

const AddStudent: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetchCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/account/register/student/", {
        first_name: firstName,
        email: email,
        password: password,
        last_name: lastName,
        last_name2: lastName2,
        age: age,
        course: courseId,
      });

      alert("Estudiante añadido con éxito");
      navigate("../students");
    } catch (err) {
      setError("Error al añadir el estudiante. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <BackButton />
      <h1>Añadir Estudiante</h1>
      <form className="add-student-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName2">Segundo Apellido</label>
          <input
            type="text"
            id="lastName2"
            value={lastName2}
            onChange={(e) => setLastName2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Edad</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Añadir Estudiante"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
