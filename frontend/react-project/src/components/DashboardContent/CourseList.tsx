import React, { useState, useMemo } from "react";
import axios from "axios";
import "../../styles/DashboardContent/CourseList.css";
import { Course } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchCourses from "../../hooks/useFetchCourses";
import SortOptions from "./SortOptions";
import BackButton from "../BackButton";

const CourseList: React.FC = () => {
  const { courses, loading, error } = useFetchCourses();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedCourses = useMemo(() => {
    return courses.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Course];
      const bValue = b[sortKey as keyof Course];

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
  }, [courses, sortKey, sortOrder]);

  const handleEditClick = (courseId: number) => {
    navigate("../edit-course", { state: { courseId } });
  };

  const handleDeleteCourse = async (courseId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este curso?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/course/${courseId}/`);
        alert("Curso borrado con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de cursos
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error al borrar el curso:",
            err.response?.data || err.message
          );
        } else if (err instanceof Error) {
          console.error("Error al borrar el curso:", err.message);
        } else {
          console.error("Error desconocido al borrar el curso.");
        }
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "startDate", label: "Fecha de Inicio" },
    { value: "endDate", label: "Fecha de Fin" },
  ];

  return (
    <div className="course-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Cursos</h1>
        {role === "admin" && (
          <Link to="../add-course" className="course-add-button">
            Añadir Curso
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
      {courses.length === 0 ? (
        <div>No hay cursos disponibles</div>
      ) : (
        <ul className="course-list">
          {sortedCourses.map((course) => (
            <li key={course.id} className="course-item">
              <h2>{course.name}</h2>
              <p>
                <strong>Fecha de Inicio:</strong>{" "}
                {new Date(course.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha de Fin:</strong>{" "}
                {new Date(course.endDate).toLocaleDateString()}
              </p>
              {role === "admin" && (
                <div className="course-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(course.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
