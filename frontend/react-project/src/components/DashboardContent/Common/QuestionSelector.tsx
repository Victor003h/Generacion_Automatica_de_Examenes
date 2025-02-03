import React, { useState, useMemo } from "react";
import useFetchQuestions from "../../../hooks/useFetchQuestions";
import { Question } from "../../Interfaces";
import "../../../styles/DashboardContent/QuestionSelector.css";

interface QuestionSelectorProps {
  subjectIds: number[];
  selectedQuestions: number[];
  setSelectedQuestions: React.Dispatch<React.SetStateAction<number[]>>;
}

// Component for selecting questions
const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  subjectIds,
  selectedQuestions,
  setSelectedQuestions,
}) => {
  // Fetch questions based on subject IDs
  const { questions, loading, error } = useFetchQuestions(subjectIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Question>("content");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Handle question selection
  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Filter questions based on search term
  const filteredQuestions = useMemo(() => {
    return questions.filter((question: Question) =>
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [questions, searchTerm]);

  // Sort questions based on selected sort key and order
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

  if (loading) return <div>Cargando preguntas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="question-selector-container">
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
            {/* Add more sort options if needed */}
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
            <span>{question.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionSelector;
