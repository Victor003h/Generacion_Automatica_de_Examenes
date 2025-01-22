import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Subjects.css";
import { Subject } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchTopics from "../../hooks/useFetchSubjectTopics";
import useFetchTeachers from "../../hooks/useFetchSubjectTeachers";

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subjects/");
        setSubjects(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleEditClick = (subjectId: number) => {
    localStorage.setItem("editSubjectId", subjectId.toString());
    navigate("../edit-subject");
  };

  const handleDeleteSubject = async (subjectId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta asignatura?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/subject/${subjectId}/`);
        alert("Asignatura borrada con éxito");
        setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      } catch (error) {
        console.error("Error al borrar la asignatura:", error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="subject-list-container">
      <div className="header">
        <h1>Lista de Asignaturas</h1>
        {role === "admin" && ( // Mostrar el botón solo si el usuario es admin
          <Link to="../add-subject" className="subject-add-button">
            Añadir Asignatura
          </Link>
        )}
      </div>
      {subjects.length === 0 ? (
        <div>No hay asignaturas disponibles</div>
      ) : (
        <ul className="subject-list">
          {subjects.map((subject) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteSubject}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

interface SubjectItemProps {
  subject: Subject;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

const SubjectItem: React.FC<SubjectItemProps> = ({
  subject,
  onEditClick,
  onDeleteClick,
}) => {
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
  } = useFetchTopics(subject.id);
  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useFetchTeachers(subject.id);

  return (
    <li className="subject-item">
      <h2>{subject.name}</h2>
      <p>
        <strong>Programa de Estudio:</strong> {subject.study_program}
      </p>
      <p>
        <strong>Curso:</strong> {subject.course}
      </p>
      <p>
        <strong>Jefe de Asignatura:</strong> {subject.head_of_subject}
      </p>
      {topicsLoading ? (
        <p>Cargando temas...</p>
      ) : topicsError ? (
        <p>Error al cargar los temas</p>
      ) : (
        <p>
          <strong>Temas:</strong> {topics.map((topic) => topic.name).join(", ")}
        </p>
      )}
      {teachersLoading ? (
        <p>Cargando profesores...</p>
      ) : teachersError ? (
        <p>Error al cargar los profesores</p>
      ) : (
        <p>
          <strong>Profesores:</strong>{" "}
          {teachers
            .map((teacher) => `${teacher.first_name} ${teacher.last_name}`)
            .join(", ")}
        </p>
      )}

      <div className="subject-actions">
        {localStorage.getItem("role") === "admin" && ( // Mostrar los botones solo si el usuario es admin
          <div className="subject-actions">
            <button
              className="edit-button"
              onClick={() => onEditClick(subject.id)}
            >
              Editar
            </button>
            <button
              className="delete-button"
              onClick={() => onDeleteClick(subject.id)}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default SubjectList;
