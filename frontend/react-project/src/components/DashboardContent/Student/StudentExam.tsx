import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
// Importación de estilos y componentes necesarios
import "../../../styles/DashboardContent/ExamList.css";
import { Exam } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import useFetchStudentSubjects from "../../../hooks/useFetchStudentSubjects";
import useFetchValidatedExams from "../../../hooks/useFetchValidatedExams";
import SortOptions from "../Common/SortOptions";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/CrudButtons.css";
import "../../../styles/DashboardContent/Pagination.css";

const StudentExam: React.FC = () => {
  // Obtención del ID del usuario desde el almacenamiento local
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  // Uso de hooks personalizados para obtener datos de asignaturas y exámenes validados
  const {
    subjects: studentSubjects,
    loading: studentSubjectsLoading,
    error: studentSubjectsError,
  } = useFetchStudentSubjects(parseInt(userId));

  const {
    validatedExams,
    loading: validatedExamsLoading,
    error: validatedExamsError,
  } = useFetchValidatedExams();

  // Definición de estados locales para almacenar exámenes, detalles de exámenes, etc.
  const [exams, setExams] = useState<(Exam & { validatedExamId: number, typeExam: string })[]>([]);
  const [examDetails, setExamDetails] = useState<{ [key: number]: { subjectName: string; teacherName: string } }>({});
  const [examsDone, setExamsDone] = useState<{ [key: number]: boolean }>({});

  // Efecto para obtener los exámenes validados
  useEffect(() => {
    if (validatedExams.length > 0) {
      const fetchExams = async () => {
        try {
          const examPromises = validatedExams.map((validatedExam) =>
            axios
              .get(`http://localhost:8000/api/exam/${validatedExam.exam}/`)
              .then((res) => ({
                ...res.data,
                validatedExamId: validatedExam.id,
                typeExam: validatedExam.type
              }))
          );
          const examsData = await Promise.all(examPromises);
          setExams(examsData);
        } catch (error) {
          console.error("Error fetching exams:", error);
        }
      };

      fetchExams();
    }
  }, [validatedExams]);

  // Efecto para obtener los detalles de los exámenes
  useEffect(() => {
    if (!Array.isArray(studentSubjects) || !Array.isArray(exams)) return;

    const fetchExamDetails = async (examId: number, subjectId: number, teacherId: number) => {
      if (subjectId && teacherId) {
        try {
          const subjectResponse = await axios.get(`http://localhost:8000/api/subject/${subjectId}/`);
          const teacherResponse = await axios.get(`http://localhost:8000/api/account/teacher/${teacherId}`);
          setExamDetails((prevDetails) => ({
            ...prevDetails,
            [examId]: {
              subjectName: subjectResponse.data.name,
              teacherName: `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`,
            },
          }));
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error(`No se encontró el recurso: ${error.response.config.url}`);
          } else {
            console.error(`Error fetching details for exam ${examId}:`, error);
          }
        }
      }
    };

    exams.forEach((exam) => {
      fetchExamDetails(exam.id, exam.subject, exam.teacher);
    });
  }, [exams, studentSubjects]);

  // Efecto para verificar si los exámenes han sido realizados
  useEffect(() => {
    const checkExamsDone = async () => {
      try {
        const examsDonePromises = exams.map(async (exam) => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/exam_done/exist/${userId}/${exam.id}`);
            const exist = response.data[0]?.includes("True");
            return { examId: exam.id, done: exist };
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              return { examId: exam.id, done: false };
            } else {
              throw error;
            }
          }
        });
        const examsDoneData = await Promise.all(examsDonePromises);
        const examsDoneMap = examsDoneData.reduce((acc, { examId, done }) => {
          acc[examId] = done;
          return acc;
        }, {} as { [key: number]: boolean });
        setExamsDone(examsDoneMap);
      } catch (error) {
        console.error("Error checking if exams are done:", error);
      }
    };

    if (exams.length > 0) {
      checkExamsDone();
    }
  }, [exams, userId]);

  // Filtrado de exámenes basados en las asignaturas del estudiante
  const filteredExams = useMemo(() => {
    if (!Array.isArray(studentSubjects) || !Array.isArray(exams)) return [];
    const studentSubjectIds = studentSubjects.map((subject) => subject.id);
    return exams.filter((exam) => studentSubjectIds.includes(exam.subject));
  }, [exams, studentSubjects]);

  // Definición de estados locales para la ordenación y paginación
  const [sortKey, setSortKey] = useState<string>("type");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Uso de useMemo para ordenar los exámenes
  const sortedExams = useMemo(() => {
    if (!Array.isArray(filteredExams)) return [];
    return filteredExams.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Exam];
      const bValue = b[sortKey as keyof Exam];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredExams, sortKey, sortOrder]);

  // Uso de useMemo para paginar los exámenes
  const paginatedExams = useMemo(() => {
    if (!Array.isArray(sortedExams)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExams.slice(startIndex, endIndex);
  }, [sortedExams, currentPage]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  // Manejo de navegación para ver y tomar exámenes
  const handleViewExam = (examId: number) => {
    navigate("../view-exam", {
      state: { examId },
    });
  };

  const handleTakeExam = (examId: number, validatedExamId: number) => {
    navigate("../take-exam", {
      state: { examId, validatedExamId },
    });
  };

  // Manejo de estados de carga y error
  if (studentSubjectsLoading || validatedExamsLoading) return <div>Cargando...</div>;
  if (studentSubjectsError) return <div>{studentSubjectsError}</div>;
  if (validatedExamsError) return <div>{validatedExamsError}</div>;

  const sortOptions = [
    { value: "type", label: "Tipo" },
    { value: "date", label: "Fecha" },
  ];

  return (
    <div className="exam-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Exámenes</h1>
      </div>
      <SortOptions
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        options={sortOptions}
      />
      {paginatedExams.length === 0 ? (
        <div>No hay exámenes disponibles</div>
      ) : (
        <ul className="exam-list">
          {paginatedExams.map((exam) => (
            <li key={`${exam.id}-${exam.validatedExamId}`} className="exam-item">
              <div className="exam-details">
                <h2>{exam.typeExam}</h2>
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
                {!examsDone[exam.id] && (
                  <button
                    className="take-exam-button"
                    onClick={() => handleTakeExam(exam.id, exam.validatedExamId)}
                  >
                    Responder Examen
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StudentExam;
