import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/ExamList.css";
import { Exam, Observation} from "../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllExams from "../../../hooks/useFetchAllExams";
import useFetchTeacherSubjects from "../../../hooks/useFetchTeacherSubjects";
import SortOptions from "../Common/SortOptions";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/CrudButtons.css";
import "../../../styles/DashboardContent/Pagination.css"; // Importar los estilos de paginación

// Componente para listar exámenes
const ExamList: React.FC = () => {
  const role = localStorage.getItem("role") || "";
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;
  const {
    exams,
    loading: examsLoading,
    error: examsError,
  } = useFetchAllExams();
  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchTeacherSubjects(userId, role);

  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<string>("type");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});

  // Obtener detalles de los exámenes
  useEffect(() => {
    const fetchExamDetails = async () => {
      for (const exam of exams) {
        const subjectResponse = await axios.get(
          `http://localhost:8000/api/subject/${exam.subject}/`
        );
        const teacherResponse = await axios.get(
          `http://localhost:8000/api/account/teacher/${exam.teacher}`
        );
        setExamDetails((prevDetails) => ({
          ...prevDetails,
          [exam.id]: {
            subjectName: subjectResponse.data.name,
            teacherName: `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`,
          },
        }));
      }
    };

    if (exams.length > 0) {
      fetchExamDetails();
    }
  }, [exams]);

  // Filtrar exámenes según el rol del usuario
  const filteredExams = useMemo(() => {
    if (role === "admin") {
      return exams;
    }
    if (subjects.length === 0) {
      return [];
    }
    const subjectIds = subjects.map((subject) => subject.id);
    return exams.filter((exam) => subjectIds.includes(exam.subject));
  }, [exams, role, subjects]);

  // Ordenar exámenes
  const sortedExams = useMemo(() => {
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

  // Paginación de exámenes
  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExams.slice(startIndex, endIndex);
  }, [sortedExams, currentPage]);

  const totalPages = Math.ceil(sortedExams.length / itemsPerPage);

  // Manejar clic en editar examen
  const handleEditClick = (examId: number) => {
    navigate("../edit-exam", { state: { examId } });
  };

  // Manejar eliminación de examen
  const handleDeleteExam = async (examId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este examen?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/exam/${examId}/`);
        alert("Examen borrado con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de exámenes
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error al borrar el examen:",
            err.response?.data || err.message
          );
        } else if (err instanceof Error) {
          console.error("Error al borrar el examen:", err.message);
        } else {
          console.error("Error desconocido al borrar el examen.");
        }
      }
    }
  };

  // Manejar visualización de examen
  const handleViewExam = (examId: number) => {
    navigate("../view-exam", {
      state: { examId },
    });
  };

  if (examsLoading || subjectsLoading) return <div>Cargando...</div>;
  if (examsError) return <div>{examsError}</div>;
  if (subjectsError && role !== "admin") return <div>{subjectsError}</div>;

  const sortOptions = [
    { value: "type", label: "Tipo" },
    { value: "date", label: "Fecha" },
  ];
  // Manejar observaciones del examen
  const handleObservation = async (examId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/exam/observations/${examId}/`);
      const observationsList: Observation[] = response.data;
      const lastObservation = observationsList[observationsList.length - 1];

      alert(`${lastObservation.observations}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al obtener las observaciones del examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al obtener las observaciones del examen:", err.message);
      } else {
        console.error("Error desconocido al obtener las observaciones del examen.");
      }
    }
  };

  return (
    <div className="exam-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Exámenes</h1>
        <Link to="../add-exam" className="exam-add-button">
          Añadir Examen
        </Link>
      </div>
      <SortOptions
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        options={sortOptions}
      />
      {paginatedExams.length === 0 ? (
        <div>
          {role === "teacher" && subjects.length === 0
            ? "No se encontraron asignaturas para este profesor."
            : "No hay exámenes disponibles."}
        </div>
      ) : (
        <ul className="exam-list">
          {paginatedExams.map((exam) => (
            <li key={exam.id} className={exam.state}>
              <h2>{exam.type}</h2>
              <p>
                <strong>Fecha:</strong>
                {new Date(exam.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Profesor:</strong>
                {examDetails[exam.id]?.teacherName || "Cargando..."}
              </p>
              <p>
                <strong>Asignatura:</strong>
                {examDetails[exam.id]?.subjectName || "Cargando..."}
              </p>
              <div className="exam-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewExam(exam.id)}
                >
                  Ver Preguntas
                </button>
                {(role === "admin" || userId === exam.teacher) && (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(exam.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      Eliminar
                    </button>
                    
                    {(exam.state === "R") && (
                       <button 
                       className="Observation-botton"
                       onClick= { () => handleObservation(exam.id)}
                     >
                       Observarciones
                     </button>
                    )}
                  
                  </>

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

export default ExamList;
