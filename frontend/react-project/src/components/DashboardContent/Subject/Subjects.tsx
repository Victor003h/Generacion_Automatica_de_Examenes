import React, { useState, useMemo } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/Subjects.css";
import { Subject } from "../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllSubjects from "../../../hooks/useFetchSubjects";
import useFetchTeacherSubjects from "../../../hooks/useFetchTeacherSubjects";
import useFetchTopicsBySubject from "../../../hooks/useFetchSubjectTopics";
import useFetchTeachersBySubject from "../../../hooks/useFetchSubjectTeachers";
import useFetchCourses from "../../../hooks/useFetchCourses";
import SortOptions from "../Common/SortOptions";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/CrudButtons.css";
import "../../../styles/DashboardContent/Pagination.css";

const SubjectList: React.FC = () => {
  // Obtener el ID del usuario y el rol desde el almacenamiento local
  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("role") || "";
  const navigate = useNavigate();

  // Obtener las asignaturas según el rol del usuario
  const {
    subjects: adminSubjects,
    loading: adminSubjectsLoading,
    error: adminSubjectsError,
  } = useFetchAllSubjects();

  const {
    subjects: teacherSubjects,
    loading: teacherSubjectsLoading,
    error: teacherSubjectsError,
  } = useFetchTeacherSubjects(Number(userId), role);

  const subjects = role === "admin" ? adminSubjects : teacherSubjects;
  const subjectsLoading =
    role === "admin" ? adminSubjectsLoading : teacherSubjectsLoading;
  const subjectsError =
    role === "admin" ? adminSubjectsError : teacherSubjectsError;

  const { courses } = useFetchCourses();

  // Estados para la ordenación y paginación
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Obtener el nombre del curso basado en su ID
  const getCourseName = (courseId: number) => {
    const course = courses.find((course) => course.id === courseId);
    return course ? course.name : "Curso no encontrado";
  };

  // Ordenar las asignaturas según la clave y el orden seleccionados
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

  // Paginación de las asignaturas
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedSubjects.slice(startIndex, endIndex);
  }, [sortedSubjects, currentPage]);

  const totalPages = Math.ceil(sortedSubjects.length / itemsPerPage);

  // Manejar el clic en el botón de editar
  const handleEditClick = (subjectId: number) => {
    localStorage.setItem("editSubjectId", subjectId.toString());
    navigate("../edit-subject");
  };

  // Manejar la eliminación de una asignatura
  const handleDeleteSubject = async (subjectId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta asignatura?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/subject/${subjectId}/`);
        alert("Asignatura borrada con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de asignaturas
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
      {paginatedSubjects.length === 0 ? (
        <div>No hay asignaturas disponibles</div>
      ) : (
        <ul className="subject-list">
          {paginatedSubjects.map((subject) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              courseName={getCourseName(subject.course)}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteSubject}
            />
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

interface SubjectItemProps {
  subject: Subject;
  courseName: string;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

const SubjectItem: React.FC<SubjectItemProps> = ({
  subject,
  courseName,
  onEditClick,
  onDeleteClick,
}) => {
  // Obtener los temas y profesores de la asignatura
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
        <strong>Curso:</strong> {courseName}
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
