import { useState, useEffect } from "react";
import axios from "axios";
import useFetchSubjects from "../../hooks/useFetchSubjects";
import { Subject, Topic } from "../../components/Interfaces";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/AddTopic.css";

const EditTopic: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjects } = useFetchSubjects();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topicName, setTopicName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const topicId = location.state?.topicId;

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/topic/${topicId}/`
        );
        const topic: Topic = response.data;
        setSelectedSubject(topic.subject);
        setTopicName(topic.name);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Error al obtener los detalles del tema."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los detalles del tema.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchTopicDetails();
    }
  }, [topicId]);

  const handleEditTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/topic/${topicId}/`, {
        name: topicName,
        Subject: selectedSubject,
      });
      alert("Tema actualizado con éxito");
      navigate("/admin-dashboard/topics");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al actualizar el tema:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al actualizar el tema:", err.message);
      } else {
        console.error("Error desconocido al actualizar el tema.");
      }
    }
  };

  return (
    <div className="add-topic-container">
      <BackButton />
      <h1>Editar Tema</h1>
      {loading && <div>Cargando asignaturas...</div>}
      {error && <div>{error}</div>}
      {!loading && subjects.length === 0 && (
        <div>No hay asignaturas disponibles</div>
      )}
      <form onSubmit={handleEditTopic}>
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
          Actualizar Tema
        </button>
      </form>
    </div>
  );
};

export default EditTopic;
