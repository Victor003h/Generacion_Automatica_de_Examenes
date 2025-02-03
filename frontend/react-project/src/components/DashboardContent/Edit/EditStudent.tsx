import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/AddStudent.css";
import BackButton from "../../BackButton";
import useFetchCourses from "../../../hooks/useFetchCourses";

// Componente para editar los detalles de un estudiante
const EditStudent: React.FC = () => {
  // Variables de estado para los detalles del estudiante
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

  // Obtener cursos usando un hook personalizado
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetchCourses();
  const studentId = localStorage.getItem("editStudentId");

  // Obtener los detalles del estudiante al montar el componente
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/account/student/${studentId}`
        );
        const student = response.data;
        setFirstName(student.first_name);
        setEmail(student.email);
        setPassword(""); // No obtener la contraseña por razones de seguridad
        setLastName(student.last_name);
        setLastName2(student.last_name2);
        setAge(student.age);
        setCourseId(student.course);
      } catch (err) {
        console.error("Error al obtener los detalles del estudiante:", err);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Manejar el envío del formulario para actualizar los detalles del estudiante
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!studentId) throw new Error("No se encontró el ID del estudiante en el almacenamiento local");
      await axios.put(
        `http://localhost:8000/api/account/student/${studentId}`,
        {
          first_name: firstName,
          email: email,
          password: password || undefined, // Enviar la contraseña solo si se ha actualizado
          last_name: lastName,
          last_name2: lastName2,
          age: age,
          course: courseId,
        }
      );

      alert("Estudiante actualizado con éxito");
      navigate("../students"); // Redirigir a la lista de estudiantes
    } catch (err) {
      setError("Error al actualizar el estudiante. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-student-container">
      <BackButton />
      <h1>Editar Estudiante</h1>
      <form className="edit-student-form" onSubmit={handleSubmit}>
        {/* Campos del formulario para los detalles del estudiante */}
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
          {loading ? "Cargando..." : "Actualizar Estudiante"}
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
