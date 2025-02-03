import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/ExamList.css";
import { Subject } from "../../Interfaces";
import SortOptions from "../Common/SortOptions";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/CrudButtons.css";
import "../../../styles/DashboardContent/Pagination.css"; // Importar los estilos de paginación
import "../../../styles/DashboardContent/ExportButtons.css"; // Importar los estilos de exportación

interface ExamData {
  exam: number;
  date: string;
  creator: string;
}

const ExamListBySubject: React.FC = () => {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);

  const [sortKey, setSortKey] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subjects/");
        setSubjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]); // Asegurarnos de que subjects sea un array vacío en caso de error
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      if (subjectId === null) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/subject/exams/${subjectId}`
        );
        const examData = Array.isArray(response.data) ? response.data : [];
        setExams(examData);
      } catch (err) {
        console.error("Error fetching exam data:", err);
        setError("Error fetching exam data");
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [subjectId]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubjectId(Number(e.target.value));
  };

  const handleExport = async (format: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/export/${format}/`,
        {
          title: "Lista de Exámenes",
          content: exams,
        }
      );
      console.log("Export successful:", response.data);
      // Aquí podrías manejar la descarga del archivo o cualquier otra acción de éxito
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const sortedExams = useMemo(() => {
    return exams.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof ExamData];
      const bValue = b[sortKey as keyof ExamData];

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
  }, [exams, sortKey, sortOrder]);

  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExams.slice(startIndex, endIndex);
  }, [sortedExams, currentPage]);

  const totalPages = Math.ceil(sortedExams.length / itemsPerPage);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const sortOptions = [
    { value: "date", label: "Fecha" },
    { value: "teacher", label: "Profesor" },
  ];

  return (
    <div className="exam-list-container">
      <BackButton />
      <div className="header">
        <h1>Lista de Exámenes por Asignatura</h1>
        <div>
          <label htmlFor="subjectSelect">Seleccionar Asignatura:</label>
          <select id="subjectSelect" onChange={handleSubjectChange}>
            <option value="">Selecciona una asignatura</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <SortOptions
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        options={sortOptions}
      />
      <button onClick={() => setShowExportOptions(!showExportOptions)}>
        Exportar
      </button>
      {showExportOptions && (
        <div className="export-buttons">
          <button onClick={() => handleExport("pdf")}>Exportar a PDF</button>
          <button onClick={() => handleExport("csv")}>Exportar a CSV</button>
        </div>
      )}
      {paginatedExams.length === 0 ? (
        <div>No hay exámenes disponibles para la asignatura seleccionada.</div>
      ) : (
        <div className="exam-cards">
          {paginatedExams.map((exam) => (
            <div key={exam.exam} className="exam-card">
              <h2>ID del Examen: {exam.exam}</h2>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(exam.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Profesor:</strong> {exam.creator}
              </p>
            </div>
          ))}
        </div>
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

export default ExamListBySubject;
