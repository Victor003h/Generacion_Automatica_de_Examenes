import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetchQuestions from "../../hooks/useFetchQuestions";
import { Question } from "../Interfaces";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/AddExamQuestions.css";
import axios from "axios";

const EditExamQuestions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    examId,
    selectedQuestions: initialSelectedQuestions,
    subject,
    type,
    date,
    teacher,
  } = location.state || { selectedQuestions: [], subject: null };

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(
    initialSelectedQuestions
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Question>("content");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { questions, loading, error } = useFetchQuestions(
    subject ? [subject] : []
  );

  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question: Question) =>
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [questions, searchTerm]);

  const sortedQuestions = useMemo(() => {
    return filteredQuestions.slice().sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [filteredQuestions, sortKey, sortOrder]);

  const handleConfirmSelection = async () => {
    try {
      const updatedExam = {
        type: type,
        date: date,
        teacher: teacher,
        subject: subject,
        questions: selectedQuestions,
      };

      await axios.put(`http://localhost:8000/api/exam/${examId}/`, updatedExam);

      navigate("../edit-exam", {
        state: { examId, selectedQuestions, subject, type, date, teacher },
      });
    } catch (err: unknown) {
      console.error("Error al guardar las preguntas seleccionadas:", err);
    }
  };

  if (loading) return <div>Cargando preguntas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-exam-questions-container">
      <BackButton />
      <h2>Seleccionar Preguntas</h2>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Buscar preguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sort-options">
          <label>Ordenar por:</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as keyof Question)}
          >
            <option value="content">Contenido</option>
            <option value="type">Tipo</option>
            <option value="difficulty">Dificultad</option>
            <option value="date">Fecha</option>
          </select>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "Ascendente" : "Descendente"}
          </button>
        </div>
      </div>
      <ul className="question-list">
        {sortedQuestions.map((question: Question) => (
          <li key={question.id} className="question-item">
            <input
              type="checkbox"
              checked={selectedQuestions.includes(question.id)}
              onChange={() => handleSelectQuestion(question.id)}
            />
            <div className="question-content">
              <p>
                <strong>Contenido:</strong> {question.content}
              </p>
              <p>
                <strong>Tipo:</strong> {question.type}
              </p>
              <p>
                <strong>Dificultad:</strong> {question.difficulty}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(question.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Profesor:</strong> {question.teacher}
              </p>
              <p>
                <strong>Tema:</strong> {question.topic}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmSelection} className="confirm-button">
        Aceptar
      </button>
    </div>
  );
};

export default EditExamQuestions;
