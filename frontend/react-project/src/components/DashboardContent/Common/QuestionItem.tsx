import React from "react";
import { Question } from "../../Interfaces";
import ScrollableQuestion from "./ScrollableQuestion";
import "../../../styles/DashboardContent/QuestionsList.css";

interface QuestionItemProps {
  question: Question;
  topics: { [key: number]: string };
  teachers: { [key: number]: { firstName: string; lastName: string } };
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; // Function for editing question
}

// Component for displaying a question item
const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  topics,
  teachers,
  onDelete,
  onEdit,
}) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Translate question type to readable format
  const translateType = (type: string) => {
    switch (type) {
      case "E":
        return "Ensayo";
      case "MO":
        return "Opción Múltiple";
      case "TF":
        return "Verdadero/Falso";
      default:
        return type;
    }
  };

  // Translate difficulty level to readable format
  const translateDifficulty = (difficulty: string) => {
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

  // Check if the user is allowed to perform actions on the question
  const isActionAllowed =
    userId === String(question.teacher) || role === "admin";

  return (
    <div className="question-item">
      <div className="question-header">
        <span>
          <strong>Fecha:</strong> {question.date}
        </span>
        <span>
          <strong>Tema:</strong> {topics[question.topic] || "Cargando..."}
        </span>
        <span>
          <strong>Tipo:</strong> {translateType(question.type)}
        </span>
        <span>
          <strong>Dificultad:</strong>{" "}
          {translateDifficulty(question.difficulty)}
        </span>
        <span>
          <strong>Profesor:</strong>{" "}
          {teachers[Number(question.teacher)]?.firstName}{" "}
          {teachers[Number(question.teacher)]?.lastName}
        </span>
      </div>
      <ScrollableQuestion content={question.content} />
      <div className="question-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(question.id)}
          disabled={!isActionAllowed}
        >
          Editar
        </button>
        {Number(question.teacher) === Number(userId) && (
          <button
            className="delete-button"
            onClick={() => onDelete(question.id)}
            disabled={!isActionAllowed}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;
