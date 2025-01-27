import React, { useState, useMemo } from "react";
import axios from "axios";
import "../../styles/DashboardContent/TeacherList.css";
import { Teacher } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllTeachers from "../../hooks/useFetchAllTeachers";
import useFetchTeacherSubjects from "../../hooks/useFetchTeacherSubjects";
import SortOptions from "./SortOptions";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/CrudButtons.css";
import "../../styles/DashboardContent/Pagination.css"; // Importar los estilos de paginación

const TeacherList: React.FC = () => {
  const { teachers, loading, error } = useFetchAllTeachers();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const [sortKey, setSortKey] = useState<string>("first_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const sortedTeachers = useMemo(() => {
    return teachers.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Teacher];
      const bValue = b[sortKey as keyof Teacher];

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
  }, [teachers, sortKey, sortOrder]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTeachers.slice(startIndex, endIndex);
  }, [sortedTeachers, currentPage]);

  const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);

  const handleEditClick = (teacherId: number) => {
    navigate("../edit-teacher", { state: { teacherId } });
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este profesor?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/account/teacher/${teacherId}`
        );
        alert("Profesor borrado con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de profesores
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error al borrar el profesor:",
            err.response?.data || err.message
          );
        } else if (err instanceof Error) {
          console.error("Error al borrar el profesor:", err.message);
        } else {
          console.error("Error desconocido al borrar el profesor.");
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
    <div className="teacher-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Profesores</h1>
        {role === "admin" && (
          <Link to="../add-teacher" className="teacher-add-button">
            Añadir Profesor
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
      {paginatedTeachers.length === 0 ? (
        <div>No hay profesores disponibles</div>
      ) : (
        <ul className="teacher-list">
          {paginatedTeachers.map((teacher) => (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              role={role}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteTeacher}
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

interface TeacherItemProps {
  teacher: Teacher;
  role: string;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

const TeacherItem: React.FC<TeacherItemProps> = ({
  teacher,
  role,
  onEditClick,
  onDeleteClick,
}) => {
  const { subjects, loading, error } = useFetchTeacherSubjects(
    String(teacher.id)
  );

  return (
    <li className="teacher-item">
      <h2>
        {teacher.first_name} {teacher.last_name}
      </h2>
      <p>
        <strong>Email:</strong> {teacher.email}
      </p>
      <p>
        <strong>Especialidad:</strong> {teacher.speciality}
      </p>
      {loading ? (
        <p>Cargando asignaturas...</p>
      ) : error ? (
        <p>No se encuantran asignaturas</p>
      ) : (
        <p>
          <strong>Asignaturas que imparte: </strong>
          {subjects.map((subject) => subject.name).join(", ")}
        </p>
      )}
      {role === "admin" && (
        <div className="teacher-actions">
          <button
            className="edit-button"
            onClick={() => onEditClick(teacher.id)}
          >
            Editar
          </button>
          <button
            className="delete-button"
            onClick={() => onDeleteClick(teacher.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </li>
  );
};

export default TeacherList;
