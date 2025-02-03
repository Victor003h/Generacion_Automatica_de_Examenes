import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/DefineExamType.css";
import { Exam } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import useFetchHeadOfSubjects from "../../../hooks/useFetchHeadOfSubjects";
import BackButton from "../../BackButton";

const DefineExamType: React.FC = () => {
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchHeadOfSubjects(Number(userId));

  const subjectIds = useMemo(
    () => subjects.map((subject) => subject.id),
    [subjects]
  );
  const options = ["Intrasemestral", "Final", "Extraordinario", "Mundial"];
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});
  const [selectedExamid, setSelectedExamid] = useState<number | null>(null);
  const [showDefineModal, setShowDefineModal] = useState<boolean>(false);
  const [type, setType] = useState<string | null>(null);
  const navigate = useNavigate();

  // Efecto para obtener los exámenes
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/exam/bystate/V"
        );
        const examList: Exam[] = response.data;
        setExams(examList);
      } catch (err) {
        console.error("Error al obtener los exámenes:", err);
      }
    };

    fetchExams();
  }, []);

  // Efecto para obtener los detalles de los exámenes
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

  // Filtrar exámenes por asignaturas del usuario
  const filteredExams = useMemo(() => {
    if (subjectIds.length === 0) {
      return [];
    }
    return exams.filter((exam) => subjectIds.includes(exam.subject));
  }, [exams, subjectIds]);

  // Manejar la acción de ver un examen
  const handleViewExam = (examId: number) => {
    navigate("../view-exam", {
      state: { examId },
    });
  };

  // Manejar la acción de definir el tipo de examen
  const handleDefineType = (examId: number) => {
    setSelectedExamid(examId);
    setShowDefineModal(true);
  };

  // Manejar la acción de definir el tipo de examen en el servidor
  const handleDefineExamen = async () => {
    if (!selectedExamid) return;
    try {
      await axios.post("http://localhost:8000/api/assigned_exam/", {
        type,
        exam: selectedExamid,
      });
      setShowDefineModal(false);
      alert("Tipo de Examen definido exitosamente");
      setExams((prevExams) =>
        prevExams.filter((ex) => ex.id !== selectedExamid)
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al definir Tipo de Examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al definir Tipo de Examen:", err.message);
      } else {
        console.error("Error desconocido al definir Tipo de Examen.");
      }
    }
  };

  if (subjectsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;

  return (
    <div className="define-exam-type-container">
      <BackButton />
      <h2>Definir Tipo de Examen</h2>
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
                  className="define-Type-button"
                  onClick={() => handleDefineType(exam.id)}
                >
                  Definir Tipo Examen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDefineModal && (
        <div className="define-exam-type-modal">
          <h3>Selecciona el tipo de examen</h3>
          {options.map((option) => (
            <div key={option}>
              <input
                type="radio"
                id={option}
                name="examType"
                value={option}
                onChange={(e) => setType(e.target.value)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
          <button onClick={() => setShowDefineModal(false)}>Cancelar</button>
          <button onClick={handleDefineExamen}>Aceptar</button>
        </div>
      )}
    </div>
  );
};

export default DefineExamType;
