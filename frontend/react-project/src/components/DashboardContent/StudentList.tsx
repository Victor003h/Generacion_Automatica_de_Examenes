import React, { useState, useMemo } from "react";
import axios from "axios";
import "../../styles/DashboardContent/StudentList.css";
import "../../styles/DashboardContent/Pagination.css"; // Importar los estilos de paginación
import { Student } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllStudents from "../../hooks/useFetchAllStudents";
import useFetchCourses from "../../hooks/useFetchCourses";
import SortOptions from "./SortOptions";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/CrudButtons.css";

const StudentList: React.FC = () => {
  const { students, loading, error } = useFetchAllStudents();
  const { courses } = useFetchCourses();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const [sortKey, setSortKey] = useState<string>("first_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const getCourseName = (courseId: number) => {
    const course = courses.find((course) => course.id === courseId);
    return course ? course.name : "Curso no encontrado";
  };

  const sortedStudents = useMemo(() => {
    return students.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Student];
      const bValue = b[sortKey as keyof Student];

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
  }, [students, sortKey, sortOrder]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedStudents.slice(startIndex, endIndex);
  }, [sortedStudents, currentPage]);

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handleEditClick = (studentId: number) => {
    localStorage.setItem("editStudentId", studentId.toString());
    navigate("../edit-student");
  };

  const handleDeleteStudent = async (studentId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este estudiante?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/account/student/${studentId}/`
        );
        alert("Estudiante borrado con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de estudiantes
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error al borrar el estudiante:",
            err.response?.data || err.message
          );
        } else if (err instanceof Error) {
          console.error("Error al borrar el estudiante:", err.message);
        } else {
          console.error("Error desconocido al borrar el estudiante.");
        }
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const sortOptions = [
    { value: "first_name", label: "Nombre" },
    { value: "last_name", label: "Apellido" },
    { value: "email", label: "Email" },
  ];

  return (
    <div className="student-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Estudiantes</h1>
        {role === "admin" && (
          <Link to="../add-student" className="student-add-button">
            Añadir Estudiante
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
      {paginatedStudents.length === 0 ? (
        <div>No hay estudiantes disponibles</div>
      ) : (
        <ul className="student-list">
          {paginatedStudents.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              courseName={getCourseName(student.course)}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteStudent}
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

interface StudentItemProps {
  student: Student;
  courseName: string;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

const StudentItem: React.FC<StudentItemProps> = ({
  student,
  courseName,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <li className="student-item">
      <h2>
        {student.first_name} {student.last_name} {student.last_name2}
      </h2>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <p>
        <strong>Curso:</strong> {courseName}
      </p>
      {localStorage.getItem("role") === "admin" && (
        <div className="student-actions">
          <button
            className="edit-button"
            onClick={() => onEditClick(student.id)}
          >
            Editar
          </button>
          <button
            className="delete-button"
            onClick={() => onDeleteClick(student.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </li>
  );
};

export default StudentList;
