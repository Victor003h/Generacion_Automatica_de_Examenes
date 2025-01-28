import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/ViewExam.css";
import { Exam, Question } from "../Interfaces"; // Importar los tipos necesarios

const ViewExam: React.FC = () => {
  const location = useLocation();
  const examId = location.state?.examId;
  const [exam, setExam] = useState<Exam | null>(null); // Usar tipo Exam o null
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const examResponse = await axios.get(
          `http://localhost:8000/api/exam/${examId}/`
        );
        setExam(examResponse.data);

        const questionsResponse = await axios.get(
          `http://localhost:8000/api/exam/${examId}/questions/`
        );
        setQuestions(questionsResponse.data);
      } catch (err: unknown) {
        console.error("Error al obtener los detalles del examen:", err);
      }
    };

    fetchExamDetails();
  }, [examId]);

  if (!exam) {
    return <div>Cargando detalles del examen...</div>;
  }

  return (
    <div className="view-exam-container">
      <BackButton />
      <h3>Preguntas</h3>
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id} className="question-item">
            <div className="question-content">
              <p>
                <strong>Contenido:</strong> {question.content}
              </p>
              <p>
                <strong>Tipo:</strong> {question.type}
              </p>
              <p>
                <strong>Dificultad:</strong> {question.difficulty}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(question.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Profesor:</strong> {question.teacher}
              </p>
              <p>
                <strong>Tema:</strong> {question.topic}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewExam;
