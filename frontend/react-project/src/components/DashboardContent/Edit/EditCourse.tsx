import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Course } from "../../Interfaces";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/AddCourse.css";

const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [course, setCourse] = useState<Course | null>(null);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/account/course/${courseId}`
        );
        const courseData: Course = response.data;
        setCourse(courseData);
        setName(courseData.name);
        setStartDate(courseData.startDate);
        setEndDate(courseData.endDate);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Error al obtener los detalles del curso."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los detalles del curso.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    } else {
      setError("No se proporcionó el ID del curso.");
      setLoading(false);
    }
  }, [courseId]);

  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/account/course/${courseId}`, {
        name,
        startDate,
        endDate,
      });
      alert("Curso actualizado con éxito");
      navigate("../courses");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al actualizar el curso:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al actualizar el curso:", err.message);
      } else {
        console.error("Error desconocido al actualizar el curso.");
      }
    }
  };

  if (loading) return <div>Cargando detalles del curso...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-course-container">
      <BackButton />
      <h1>Editar Curso</h1>
      {course ? (
        <form onSubmit={handleEditCourse}>
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
            Actualizar Curso
          </button>
        </form>
      ) : (
        <div>No se encontraron detalles del curso.</div>
      )}
    </div>
  );
};

export default EditCourse;
