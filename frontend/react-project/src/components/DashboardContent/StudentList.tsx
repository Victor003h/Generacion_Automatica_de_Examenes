import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/StudentList.css";
import { Student } from "../Interfaces";
import { Link } from "react-router-dom";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/get/students"
        );
        setStudents(response.data);
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

    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este estudiante?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/students/${studentId}/`);
        alert("Estudiante borrado con éxito");
        setStudents(students.filter((student) => student.id !== studentId));
      } catch (error) {
        console.error("Error al borrar el estudiante:", error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="student-list-container">
      <div className="header">
        <h1>Lista de Estudiantes</h1>
        <Link to="../add-student" className="student-add-button">
          Añadir Estudiante
        </Link>
      </div>
      {students.length === 0 ? (
        <div>No hay estudiantes disponibles</div>
      ) : (
        <ul className="student-list">
          {students.map((student) => (
            <li key={student.id} className="student-item">
              <h2>
                {student.first_name} {student.last_name} {student.last_name2}
              </h2>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Edad:</strong> {student.age}
              </p>
              <p>
                <strong>Curso:</strong> {student.course}
              </p>
              <div className="student-actions">
                <Link
                  to={`/edit-student/${student.id}`}
                  className="edit-button"
                >
                  Editar
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteStudent(student.id)}
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

export default StudentList;
