import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Subjects.css";
import { Subject } from "../Interfaces";
import { Link } from "react-router-dom";

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDeleteSubject = async (subjectId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta asignatura?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/subjects/${subjectId}/`);
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
        <Link to="../add-subject" className="subject-add-button">
          Añadir Asignatura
        </Link>
      </div>
      {subjects.length === 0 ? (
        <div>No hay asignaturas disponibles</div>
      ) : (
        <ul className="subject-list">
          {subjects.map((subject) => (
            <li key={subject.id} className="subject-item">
              <h2>{subject.name}</h2>
              <p>
                <strong>Descripción:</strong> {subject.description}
              </p>
              <div className="subject-actions">
                <Link
                  to={`/edit-subject/${subject.id}`}
                  className="edit-button"
                >
                  Editar
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSubject(subject.id)}
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

export default SubjectList;
