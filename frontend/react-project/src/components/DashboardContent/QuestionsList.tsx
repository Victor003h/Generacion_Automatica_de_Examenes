import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/DashboardContent/QuestionsList.css";
import { Question } from "../../components/Interfaces";

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/question");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="content-container">
      <div className="header">
        <h2>Listado de Preguntas</h2>
        <Link to="/add-question" className="add-button">
          Añadir Pregunta
        </Link>
        {/* Botón de Añadir Pregunta */}
      </div>
      <div className="question-list">
        {questions.map((question) => (
          <div key={question.id} className="question-item">
            <div className="question-header">
              <span>
                <strong>Fecha:</strong> {question.date}
              </span>
              <span>
                <strong>Tema:</strong> {question.topic}
              </span>
              <span>
                <strong>Tipo:</strong> {question.type}
              </span>
              <span>
                <strong>Dificultad:</strong> {question.difficulty}
              </span>
            </div>
            <div className="question-text">
              <p>{question.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
