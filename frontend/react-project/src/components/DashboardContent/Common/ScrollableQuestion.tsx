import React, { useState } from "react";
import "../../../styles/DashboardContent/QuestionsList.css";

interface ScrollableQuestionProps {
  content: string;
}

const ScrollableQuestion: React.FC<ScrollableQuestionProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`scrollable-question ${expanded ? "expanded" : ""}`}>
      <div className="question-content-header">Contenido:</div>
      {expanded ? (
        <div className="question-full-content">
          {content}
          <button className="toggle-button" onClick={toggleExpand}>
            Leer menos
          </button>
        </div>
      ) : (
        <div className="question-short-content">
          {`${content.slice(0, 60)}...`}
          <button className="toggle-button" onClick={toggleExpand}>
            Leer más
          </button>
        </div>
      )}
    </div>
  );
};

export default ScrollableQuestion;
