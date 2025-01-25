import React, { useState, useMemo } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Subjects.css";
import { Subject } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllSubjects from "../../hooks/useFetchSubjects";
import useFetchTeacherSubjects from "../../hooks/useFetchTeacherSubjects";
import useFetchTopicsBySubject from "../../hooks/useFetchSubjectTopics";
import useFetchTeachersBySubject from "../../hooks/useFetchSubjectTeachers";
import SortOptions from "./SortOptions";
import BackButton from "../BackButton";

const SubjectList: React.FC = () => {
  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("role") || "";
  const navigate = useNavigate();

  const {
    subjects: adminSubjects,
    loading: adminSubjectsLoading,
    error: adminSubjectsError,
  } = useFetchAllSubjects();

  const {
    subjects: teacherSubjects,
    loading: teacherSubjectsLoading,
    error: teacherSubjectsError,
  } = useFetchTeacherSubjects(userId);

  const subjects = role === "admin" ? adminSubjects : teacherSubjects;
  const subjectsLoading =
    role === "admin" ? adminSubjectsLoading : teacherSubjectsLoading;
  const subjectsError =
    role === "admin" ? adminSubjectsError : teacherSubjectsError;

  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedSubjects = useMemo(() => {
    return subjects.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Subject];
      const bValue = b[sortKey as keyof Subject];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [subjects, sortKey, sortOrder]);

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
        window.location.reload();
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error al borrar la asignatura:",
            err.response?.data || err.message
          );
        } else if (err instanceof Error) {
          console.error("Error al borrar la asignatura:", err.message);
        } else {
          console.error("Error desconocido al borrar la asignatura.");
        }
      }
    }
  };

  if (subjectsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;

  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "course", label: "Curso" },
    { value: "study_program", label: "Programa de Estudio" },
  ];

  return (
    <div className="subject-list-container">
      <div className="header">
        <BackButton />
        <h1>Lista de Asignaturas</h1>
        {role === "admin" && (
          <Link to="../add-subject" className="subject-add-button">
            Añadir Asignatura
          </Link>
        )}
      </div>
      <SortOptions
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        options={sortOptions}
      />
      {sortedSubjects.length === 0 ? (
        <div>No hay asignaturas disponibles</div>
      ) : (
        <ul className="subject-list">
          {sortedSubjects.map((subject) => (
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
  } = useFetchTopicsBySubject(subject.id);
  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useFetchTeachersBySubject(subject.id);

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
        <p>No se encontraron temas para esta asignatura.</p>
      ) : (
        <p>
          <strong>Temas:</strong> {topics.map((topic) => topic.name).join(", ")}
        </p>
      )}
      {teachersLoading ? (
        <p>Cargando profesores...</p>
      ) : teachersError ? (
        <p>No se encontraron profesores de esta asignatura.</p>
      ) : (
        <p>
          <strong>Profesores:</strong>{" "}
          {teachers
            .map((teacher) => `${teacher.first_name} ${teacher.last_name}`)
            .join(", ")}
        </p>
      )}
      {localStorage.getItem("role") === "admin" && (
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
    </li>
  );
};

export default SubjectList;
