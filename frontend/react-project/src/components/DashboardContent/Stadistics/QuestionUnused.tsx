import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/QuestionsUnused.css";
import { Subject, Question } from "../../Interfaces";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/ExportButtons.css"; // Importar los estilos de exportación

const QuestionsUnused: React.FC = () => {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchQuestions = async () => {
      if (subjectId === null) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/questions/unused/${subjectId}`
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

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubjectId(Number(e.target.value));
  };

  const handleExport = async (format: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/export/${format}/`,
        {
          title: "Preguntas No Usadas",
          content: questions,
        }
      );
      console.log("Export successful:", response.data);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const formatDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "E":
        return "Fácil";
      case "M":
        return "Media";
      case "D":
        return "Difícil";
      default:
        return difficulty;
    }
  };

  return (
    <div className="questions-unused-container">
      <BackButton />
      <div className="header">
        <h1>Preguntas No Usadas en Exámenes</h1>
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
        <div className="question-cards">
          {questions.map((question) => (
            <div key={question.id} className="question-card">
              <h2>ID de Pregunta: {question.id}</h2>
              <p>
                <strong>Dificultad:</strong>{" "}
                {formatDifficulty(question.difficulty)}
              </p>
              <p>
                <strong>Tema:</strong> {question.topic}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsUnused;
