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
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [observations, setObservations] = useState<string>("");
  const [showValidationModal, setShowValidationModal] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/exam/");
        const examList: Exam[] = response.data;
        const filteredExamList = await Promise.all(
          examList.map(async (exam) => {
            try {
              await axios.get(
                `http://localhost:8000/api/exam/isvalidated/${exam.id}`
              );
              return null;
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                return exam;
              }
              return null;
            }
          })
        );
        setExams(filteredExamList.filter((exam) => exam !== null) as Exam[]);
      } catch (err: unknown) {
        console.error("Error al obtener los exámenes:", err);
      }
    };

    const fetchExamDetails = async (
      examId: number,
      subjectId: number,
      teacherId: number
    ) => {
      const subjectResponse = await axios.get(
        `http://localhost:8000/api/subject/${subjectId}/`
      );
      const teacherResponse = await axios.get(
        `http://localhost:8000/api/teacher/${teacherId}`
      );
      setExamDetails((prevDetails) => ({
        ...prevDetails,
        [examId]: {
          subjectName: subjectResponse.data.name,
          teacherName: `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`,
        },
      }));
    };

    fetchExams();
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

  const handleValidateExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowValidationModal(true);
  };

  const handleValidationSubmit = async () => {
    if (!selectedExam) return;

    try {
      await axios.post(
        `http://localhost:8000/api/validated_exam/${selectedExam.id}/`,
        {
          observations: observations,
          exam: selectedExam.id,
          teacher: userId,
        }
      );
      alert("Examen validado exitosamente");
      setShowValidationModal(false);
      setExams((prevExams) =>
        prevExams.filter((exam) => exam.id !== selectedExam.id)
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
              </div>
            </li>
          ))}
        </ul>
      )}

      {showValidationModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Validar Examen</h3>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observaciones"
            ></textarea>
            <button onClick={handleValidationSubmit}>Aceptar</button>
            <button onClick={() => setShowValidationModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidarExamenes;
