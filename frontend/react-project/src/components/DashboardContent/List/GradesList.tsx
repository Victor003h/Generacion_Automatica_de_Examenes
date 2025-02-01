import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/GradesList.css";

interface Grade {
  id: number;
  studentName: string;
  subject: string;
  score: number;
}

const GradesList: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/grades");
        setGrades(response.data);
      } catch (error) {
        console.error("Error al obtener las calificaciones:", error);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="content-container">
      <div className="header">
        <h2>Listado de Calificaciones</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Asignatura</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td>{grade.studentName}</td>
              <td>{grade.subject}</td>
              <td>{grade.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesList;
