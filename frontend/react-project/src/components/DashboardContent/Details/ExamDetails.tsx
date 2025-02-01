import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/ExamDetails.css";
import { Exam } from "../../Interfaces";

const ExamDetails: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  useEffect(() => {
    const fetchExams = async () => {
      const examId = localStorage.getItem("examId");
      if (examId) {
        try {
          const response = await axios.get("http://localhost:8000/api/exam");
          const exams: Exam[] = response.data;
          const foundExam = exams.find(
            (exam) => exam.id === parseInt(examId, 10)
          );
          setExam(foundExam || null);
        } catch (error) {
          console.error("Error al obtener los detalles del examen:", error);
        }
      }
    };
    fetchExams();
  }, []);
  if (!exam) {
    return <div>Cargando detalles del examen...</div>;
  }
  return (
    <div className="exam-details-container">
      <h2>Detalles del Examen</h2>
      <div className="exam-details">
        <p>
          <strong>Asignatura:</strong> {exam.subject}
        </p>
        <p>
          <strong>Tipo:</strong> {exam.type}
        </p>
        <p>
          <strong>Fecha:</strong> {exam.date}
        </p>
        <p>
          <strong>Profesor:</strong> {exam.teacher}
        </p>
        {/* Añadir más detalles según sea necesario */}
      </div>
    </div>
  );
};

export default ExamDetails;
