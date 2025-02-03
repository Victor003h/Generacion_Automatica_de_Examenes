import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/QuestionMostUsed.css";
import { Subject } from "../../Interfaces";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/ExportButtons.css"; // Importar los estilos de exportación

interface QuestionData {
  question: number;
  difficulty: string;
  topic: number;
  used: number;
}

const QuestionMostUsed: React.FC = () => {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  // Efecto para obtener las asignaturas al montar el componente
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subjects/");
        setSubjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  // Efecto para obtener las preguntas más usadas cuando cambia el subjectId
  useEffect(() => {
    const fetchQuestions = async () => {
      if (subjectId === null) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/questions/most_used/${subjectId}`
        );
        const questionData = Array.isArray(response.data) ? response.data : [];
        setQuestions(questionData);
      } catch (err) {
        console.error("Error fetching question data:", err);
        setError("Error fetching question data");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectId]);

  // Manejar el cambio de asignatura seleccionada
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubjectId(Number(e.target.value));
  };

  // Manejar la exportación de datos en diferentes formatos
  const handleExport = async (format: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/export/${format}/`,
        {
          title: "Preguntas Más Usadas en Exámenes Finales",
          content: questions,
        }
      );
      console.log("Export successful:", response.data);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // Renderizar la dificultad en español
  const renderDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "M":
        return "Media";
      case "E":
        return "Fácil";
      case "D":
        return "Difícil";
      default:
        return difficulty;
    }
  };

  return (
    <div className="question-most-used-container">
      <BackButton />
      <div className="header">
        <h1>Preguntas Más Usadas En Exámenes Finales</h1>
        <div className="input-group">
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
        <div className="export-button-group">
          <button
            onClick={() => setExportVisible(!exportVisible)}
            className="export-main-button"
          >
            Exportar
          </button>
          {exportVisible && (
            <div className="export-options">
              <button
                onClick={() => handleExport("pdf")}
                className="export-option-button"
              >
                Exportar a PDF
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="export-option-button"
              >
                Exportar a CSV
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="question-list">
          {questions.map((question) => (
            <div key={question.question} className="question-item">
              <h2>ID de Pregunta: {question.question}</h2>
              <p>
                <strong>Dificultad:</strong>{" "}
                {renderDifficulty(question.difficulty)}
              </p>
              <p>
                <strong>Tema:</strong> {question.topic}
              </p>
              <p>
                <strong>Cantidad de usos:</strong> {question.used}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionMostUsed;
