import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/GradeExams.css";
import { Subject } from "../../Interfaces";

const GradeExams: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const url =
          role === "admin"
            ? "http://localhost:8000/api/subjects/"
            : `http://localhost:8000/api/teacher/head_of_subject/${userId}`;
        const response = await axios.get(url);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    fetchSubjects();
  }, [userId, role]);

  const handleViewExams = (subjectId: number) => {
    navigate("../view-exams-done", { state: { subjectId } });
  };

  return (
    <div className="grade-exams-container">
      <h2>Calificar Exámenes</h2>
      {subjects.length === 0 ? (
        <p>No hay asignaturas disponibles.</p>
      ) : (
        subjects.map((subject: Subject) => (
          <div key={subject.id} className="subject-container">
            <h3>{subject.name}</h3>
            <button onClick={() => handleViewExams(subject.id)}>
              Ver Exámenes
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default GradeExams;
