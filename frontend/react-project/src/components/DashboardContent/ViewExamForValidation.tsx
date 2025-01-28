import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/ViewExamForValidation.css";
import { Exam, Question } from "../Interfaces";

const ViewExamForValidation: React.FC = () => {
  const location = useLocation();
  const examId = location.state?.examId;
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjectName, setSubjectName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const examResponse = await axios.get(
          `http://localhost:8000/api/exam/${examId}/`
        );
        const exam: Exam = examResponse.data;
        setExam(exam);

        // Obtener nombres de asignatura y profesor
        const subjectResponse = await axios.get(
          `http://localhost:8000/api/subject/${exam.subject}/`
        );
        setSubjectName(subjectResponse.data.name);

        const teacherResponse = await axios.get(
          `http://localhost:8000/api/teacher/${exam.teacher}`
        );
        setTeacherName(
          `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`
        );

        const questionsResponse = await axios.get(
          `http://localhost:8000/api/exam/questions/${examId}/`
        );
        setQuestions(questionsResponse.data);
      } catch (err: unknown) {
        console.error("Error al obtener los detalles del examen:", err);
      }
    };

    fetchExamDetails();
  }, [examId]);

  const handleValidateExam = async () => {
    try {
      await axios.post(`http://localhost:8000/api/validated_exam/${examId}/`);
      alert("Examen validado exitosamente");
      navigate(-1); // Regresar a la lista de exámenes para validar
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al validar el examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al validar el examen:", err.message);
      } else {
        console.error("Error desconocido al validar el examen.");
      }
    }
  };

  if (!exam) {
    return <div>Cargando detalles del examen...</div>;
  }

  return (
    <div className="view-exam-container">
      <BackButton />
      <h2>Detalles del Examen</h2>
      <div className="exam-details">
        <p>
          <strong>Tipo:</strong> {exam.type}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(exam.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Asignatura:</strong> {subjectName}
        </p>
        <p>
          <strong>Profesor:</strong> {teacherName}
        </p>
      </div>
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
      <button onClick={handleValidateExam} className="validate-button">
        Validar Examen
      </button>
    </div>
  );
};

export default ViewExamForValidation;
