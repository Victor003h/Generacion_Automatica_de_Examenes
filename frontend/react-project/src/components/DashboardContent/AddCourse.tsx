import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/AddCourse.css";

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/course/", {
        name,
        startDate,
        endDate,
      });
      alert("Curso añadido con éxito");
      navigate("/admin-dashboard/courses");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al añadir el curso:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al añadir el curso:", err.message);
      } else {
        console.error("Error desconocido al añadir el curso.");
      }
    }
  };

  return (
    <div className="add-course-container">
      <BackButton />
      <h1>Añadir Nuevo Curso</h1>
      <form onSubmit={handleAddCourse}>
        <div className="form-group">
          <label htmlFor="name">Nombre del Curso:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Fecha de Inicio:</label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Fecha de Fin:</label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Añadir Curso
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
