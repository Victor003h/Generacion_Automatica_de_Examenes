import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/TeacherList.css";
import { Teacher } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/teacher"
        );
        setTeachers(response.data);
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

    fetchTeachers();
  }, []);

  const handleEditClick = (teacherId: number) => {
    localStorage.setItem("editTeacherId", teacherId.toString());
    navigate("/admin-dashboard/edit-teacher");
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
        setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
      } catch (error) {
        console.error("Error al borrar el profesor:", error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="teacher-list-container">
      <div className="header">
        <h1>Lista de Profesores</h1>
        <Link to="../add-teacher" className="teacher-add-button">
          Añadir Profesor
        </Link>
      </div>
      {teachers.length === 0 ? (
        <div>No hay profesores disponibles</div>
      ) : (
        <ul className="teacher-list">
          {teachers.map((teacher) => (
            <li key={teacher.id} className="teacher-item">
              <h2>
                {teacher.first_name} {teacher.last_name} {teacher.last_name2}
              </h2>
              <p>
                <strong>Email:</strong> {teacher.email}
              </p>
              <p>
                <strong>Especialidad:</strong> {teacher.speciality}
              </p>
              <div className="teacher-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(teacher.id)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTeacher(teacher.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherList;
