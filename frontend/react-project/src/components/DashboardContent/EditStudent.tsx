import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/AddStudent.css";
import BackButton from "../BackButton";

const EditStudent: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [course, setCourse] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("editStudentId");

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
        setPassword(""); // No se debería obtener la contraseña del backend por seguridad
        setLastName(student.last_name);
        setLastName2(student.last_name2);
        setAge(student.age);
        setCourse(student.course);
      } catch (err) {
        console.error("Error al obtener el estudiante:", err);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!studentId) throw new Error("No student ID found in local storage");
      await axios.put(
        `http://localhost:8000/api/account/student/${studentId}`,
        {
          first_name: firstName,
          email: email,
          password: password || undefined, // Enviar la contraseña solo si se ha actualizado
          last_name: lastName,
          last_name2: lastName2,
          age: age,
          course: course,
        }
      );

      alert("Estudiante actualizado con éxito");
      navigate("../students"); // Redirige a la lista de estudiantes
    } catch (err) {
      setError(
        "Error al actualizar el estudiante. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-student-container">
      <BackButton />
      <h1>Editar Estudiante</h1>
      <form className="edit-student-form" onSubmit={handleSubmit}>
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
          <input
            type="number"
            id="course"
            value={course}
            onChange={(e) => setCourse(Number(e.target.value))}
            required
          />
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
