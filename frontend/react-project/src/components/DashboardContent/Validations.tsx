import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Validations.css";
import { Exam } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import useFetchHeadOfSubjects from "../../hooks/useFetchHeadOfSubjects";
import BackButton from "../BackButton";

const ValidarExamenes: React.FC = () => {
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;
  const {
    subjectIds,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchHeadOfSubjects(userId);

  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/exam/");
        setExams(response.data);
      } catch (err: unknown) {
        console.error("Error al obtener los exámenes:", err);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = useMemo(() => {
    if (subjectIds.length === 0) {
      return [];
    }
    return exams.filter((exam) => subjectIds.includes(exam.subject));
  }, [exams, subjectIds]);

  const handleViewExam = (examId: number) => {
    navigate("../view-exam", {
      state: { examId },
    });
  };

  const handleValidateExam = async (examId: number) => {
    try {
      await axios.post(`http://localhost:8000/api/validate_exam/${examId}/`);
      alert("Examen validado exitosamente");
      // Remove the validated exam from the list
      setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
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

  if (subjectsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;

  return (
    <div className="validar-examenes-container">
      <BackButton />
      <h2>Validar Exámenes</h2>
      {filteredExams.length === 0 ? (
        <div>No hay exámenes disponibles para validar.</div>
      ) : (
        <ul className="exam-list">
          {filteredExams.map((exam) => (
            <li key={exam.id} className="exam-item">
              <div className="exam-details">
                <h2>{exam.type}</h2>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(exam.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Profesor:</strong> {exam.teacher}
                </p>
                <p>
                  <strong>Asignatura:</strong> {exam.subject}
                </p>
              </div>
              <div className="exam-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewExam(exam.id)}
                >
                  Ver Preguntas
                </button>
                <button
                  className="validate-button"
                  onClick={() => handleValidateExam(exam.id)}
                >
                  Validar Examen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ValidarExamenes;
