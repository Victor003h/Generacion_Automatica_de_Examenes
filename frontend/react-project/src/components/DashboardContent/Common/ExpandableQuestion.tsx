import React, { useState } from "react";
import "../../../styles/DashboardContent/QuestionsList.css";

interface ExpandableQuestionProps {
  content: string;
}

const ExpandableQuestion: React.FC<ExpandableQuestionProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);

  // Alterna el estado de expansión de la pregunta
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`expandable-question ${expanded ? "expanded" : ""}`}>
      <div className="question-content">
        {expanded ? content : `${content.slice(0, 0)}...`}
      </div>
      <button className="toggle-button" onClick={toggleExpand}>
        {expanded ? "Leer menos" : "Leer más"}
      </button>
    </div>
  );
};

export default ExpandableQuestion;
