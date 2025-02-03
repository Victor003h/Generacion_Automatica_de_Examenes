import React, { useState, useMemo } from "react";
// Importación de estilos y componentes necesarios
import "../../../styles/DashboardContent/Subjects.css";
import { Subject } from "../../Interfaces";
import useFetchStudentSubjects from "../../../hooks/useFetchStudentSubjects";
import useFetchTopicsBySubject from "../../../hooks/useFetchSubjectTopics";
import useFetchTeachersBySubject from "../../../hooks/useFetchSubjectTeachers";
import useFetchCourses from "../../../hooks/useFetchCourses";
import SortOptions from "../Common/SortOptions";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/CrudButtons.css";
import "../../../styles/DashboardContent/Pagination.css";

const StudentSubjects: React.FC = () => {
  // Obtención del ID del usuario desde el almacenamiento local
  const userId = localStorage.getItem("userId") || "";

  // Uso de hooks personalizados para obtener datos de asignaturas, cursos, etc.
  const {
    subjects: studentSubjects,
    loading: studentSubjectsLoading,
    error: studentSubjectsError,
  } = useFetchStudentSubjects(parseInt(userId));

  const { courses } = useFetchCourses();

  // Definición de estados locales para la ordenación y paginación
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Función para obtener el nombre del curso basado en su ID
  const getCourseName = (courseId: number) => {
    const course = courses.find((course) => course.id === courseId);
    return course ? course.name : "Curso no encontrado";
  };

  // Uso de useMemo para ordenar las asignaturas
  const sortedSubjects = useMemo(() => {
    if (!Array.isArray(studentSubjects)) return [];
    return studentSubjects.slice().sort((a, b) => {
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
  }, [studentSubjects, sortKey, sortOrder]);

  // Uso de useMemo para paginar las asignaturas
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedSubjects.slice(startIndex, endIndex);
  }, [sortedSubjects, currentPage]);

  const totalPages = Math.ceil(sortedSubjects.length / itemsPerPage);

  // Manejo de estados de carga y error
  if (studentSubjectsLoading) return <div>Cargando...</div>;
  if (studentSubjectsError) return <div>{studentSubjectsError}</div>;

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
}

// Componente para mostrar los detalles de una asignatura
const SubjectItem: React.FC<SubjectItemProps> = ({ subject, courseName }) => {
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
    </li>
  );
};

export default StudentSubjects;
