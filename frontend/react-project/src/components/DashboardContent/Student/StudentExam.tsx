import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

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

  const [exams, setExams] = useState<(Exam & { validatedExamId: number })[]>(
    []
  );
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});

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

  useEffect(() => {
    if (!Array.isArray(studentSubjects) || !Array.isArray(exams)) return;

    const fetchExamDetails = async (
      examId: number,
      subjectId: number,
      teacherId: number
    ) => {
      if (subjectId && teacherId) {
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
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error(
              `No se encontró el recurso: ${error.response.config.url}`
            );
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

  const filteredExams = useMemo(() => {
    if (!Array.isArray(studentSubjects) || !Array.isArray(exams)) return [];
    const studentSubjectIds = studentSubjects.map((subject) => subject.id);
    return exams.filter((exam) => studentSubjectIds.includes(exam.subject));
  }, [exams, studentSubjects]);

  const [sortKey, setSortKey] = useState<string>("type");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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

  const paginatedExams = useMemo(() => {
    if (!Array.isArray(sortedExams)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExams.slice(startIndex, endIndex);
  }, [sortedExams, currentPage]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

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

  if (studentSubjectsLoading || validatedExamsLoading)
    return <div>Cargando...</div>;
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
                  className="take-exam-button"
                  onClick={() => handleTakeExam(exam.id, exam.validatedExamId)}
                >
                  Responder Examen
                </button>
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
