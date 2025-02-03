// Importa las librerías necesarias de React y otros módulos
import { useState } from "react";
import axios from "axios";
import useFetchSubjects from "../../../hooks/useFetchSubjects";
import { Subject } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/AddTopic.css";

// Define el componente funcional para añadir un tema
const AddTopic: React.FC = () => {
  const navigate = useNavigate();
  const { subjects, loading, error } = useFetchSubjects();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topicName, setTopicName] = useState<string>("");

  // Maneja el envío del formulario para añadir un tema
  const handleAddTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/topic/", {
        name: topicName,
        Subject: selectedSubject,
      });
      alert("Tema añadido con éxito");
      navigate("/admin-dashboard/topics");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al añadir el tema:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al añadir el tema:", err.message);
      } else {
        console.error("Error desconocido al añadir el tema.");
      }
    }
  };

  // Renderiza el formulario para añadir un tema
  return (
    <div className="add-topic-container">
      <BackButton />
      <h1>Añadir Nuevo Tema</h1>
      {loading && <div>Cargando asignaturas...</div>}
      {error && <div>{error}</div>}
      {!loading && subjects.length === 0 && (
        <div>No hay asignaturas disponibles</div>
      )}
      <form onSubmit={handleAddTopic}>
        <div className="form-group">
          <label htmlFor="subject">Asignatura:</label>
          <select
            id="subject"
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Selecciona una asignatura
            </option>
            {subjects.map((subject: Subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="topic-name">Nombre del Tema:</label>
          <input
            id="topic-name"
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Añadir Tema
        </button>
      </form>
    </div>
  );
};

export default AddTopic;
