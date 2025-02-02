import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/Validations.css";
import { Exam } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import useFetchHeadOfSubjects from "../../../hooks/useFetchHeadOfSubjects";
import BackButton from "../../BackButton";

const ValidarExamenes: React.FC = () => {
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;
  const {
    subjectIds,
    loading: subjectsLoading,
    
    error: subjectsError,
  } = useFetchHeadOfSubjects(userId);

  const [exams, setExams] = useState<Exam[]>([]);
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [observations, setObservations] = useState<string>("");
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/exam/bystate/P");
        const examList: Exam[] = response.data;
        setExams(examList);

      } catch (err) {
        console.error("Error al obtener los exámenes:", err);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const fetchExamDetails = async (
      examId: number,
      subjectId: number,
      teacherId: number
    ) => {
      try {
        const subjectResponse = await axios.get(
          `http://localhost:8000/api/subject/${subjectId}/`
        );
        const teacherResponse = await axios.get(
          `http://localhost:8000/api/account/teacher/${teacherId}`
        );
        setExamDetails((prevDetails) => ({
          ...prevDetails,
          [examId]: {
            subjectName: subjectResponse.data.name,
            teacherName: `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`,
          },
        }));
      } catch (error) {
        console.error(`Error al obtener detalles del examen ${examId}:`, error);
      }
    };

    exams.forEach((exam) => {
      fetchExamDetails(exam.id, exam.subject, exam.teacher);
    });
  }, [exams]);

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

  const handleValidateExam = async (exam: Exam) => {
    try {
      await axios.put(`http://localhost:8000/api/exam/${exam.id}/`, {
        type: exam.type,
        state: "V",
        teacher: exam.teacher,
        validation_teacher: exam.validation,
        subject: exam.subject,
        questions: exam.questions
      });
      alert("Examen validado exitosamente");
      setExams((prevExams) =>
        prevExams.filter((ex) => ex.id !== exam.id)
      );
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

  const handleDiscardExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDiscardModal(true);
  };

  const handleDiscardSubmit = async () => {
    if (!selectedExam) return;

    try {
      await axios.put(`http://localhost:8000/api/exam/${selectedExam.id}/`, {
        type: selectedExam.type,
        state: "R",
        teacher: selectedExam.teacher,
        validation_teacher: selectedExam.validation,
        subject: selectedExam.subject,
        questions: selectedExam.questions
      });
      await axios.post(`http://localhost:8000/api/observation/`, {
        observation: observations,
        checked: false,
        exam: selectedExam.id
      });
      alert("Examen descartado exitosamente");
      setShowDiscardModal(false);
      setExams((prevExams) =>
        prevExams.filter((exam) => exam.id !== selectedExam.id)
      );
      setObservations(""); // Clear observations after submission
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al descartar el examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al descartar el examen:", err.message);
      } else {
        console.error("Error desconocido al descartar el examen.");
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
                  <strong>Profesor:</strong>{" "}
                  {examDetails[exam.id]?.teacherName || "Cargando..."}
                </p>
                <p>
                  <strong>Asignatura:</strong>{" "}
                  {examDetails[exam.id]?.subjectName || "Cargando..."}
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
                  onClick={() => handleValidateExam(exam)}
                >
                  Validar Examen
                </button>
                <button
                  className="discard-button"
                  onClick={() => handleDiscardExam(exam)}
                >
                  Descartar Examen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDiscardModal && (
        <div className="validation-modal">
          <div className="validation-modal-content">
            <h3>Descartar Examen</h3>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observaciones"
            ></textarea>
            <button onClick={handleDiscardSubmit}>Aceptar</button>
            <button onClick={() => setShowDiscardModal(false)}>
              Cancelar//
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidarExamenes;
