import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/AddTeacher.css";
import BackButton from "../../BackButton";

const EditTeacher: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const teacherId = localStorage.getItem("editTeacherId");

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/account/teacher/${teacherId}`
        );
        const teacher = response.data;
        setFirstName(teacher.first_name);
        setLastName(teacher.last_name);
        setLastName2(teacher.last_name2);
        setEmail(teacher.email);
        setSpeciality(teacher.speciality);
      } catch (err) {
        console.error("Error al obtener el profesor:", err);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!teacherId) throw new Error("No teacher ID found in local storage");
      await axios.put(
        `http://localhost:8000/api/account/teacher/${teacherId}`,
        {
          first_name: firstName,
          last_name: lastName,
          last_name2: lastName2,
          email: email,
          speciality: speciality,
          password: password || undefined, // Enviar la contraseña solo si se ha actualizado
        }
      );

      alert("Profesor actualizado con éxito");
      navigate("/admin-dashboard/teachers"); // Redirige a la lista de profesores
    } catch (err) {
      setError("Error al actualizar el profesor. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-teacher-container">
      <BackButton />
      <h1>Editar Profesor</h1>
      <form className="edit-teacher-form" onSubmit={handleSubmit}>
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
          <label htmlFor="speciality">Especialidad</label>
          <input
            type="text"
            id="speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Actualizar Profesor"}
        </button>
      </form>
    </div>
  );
};

export default EditTeacher;
