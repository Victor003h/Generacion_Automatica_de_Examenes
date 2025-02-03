import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/DashboardContent/Statistics.css";

// Componente funcional que muestra enlaces a diferentes estadísticas
const Statistics: React.FC = () => {
  return (
    <div className="statistics-container">
      <h1>Estadísticas</h1>
      <ul className="statistics-links">
        <li>
          <Link to="../exam-list-by-subject" className="statistic-button-link">
            Lista de Exámenes por Asignatura
          </Link>
        </li>
        <li>
          <Link to="../teacher-analysis" className="statistic-button-link">
            Análisis de Profesores
          </Link>
        </li>
        <li>
          <Link to="../question-most-used" className="statistic-button-link">
            Preguntas Más Usadas
          </Link>
        </li>
        <li>
          <Link to="../question-unused" className="statistic-button-link">
            Preguntas no usadas aún
          </Link>
        </li>
        {/* Añade más enlaces aquí según sea necesario */}
      </ul>
    </div>
  );
};

export default Statistics;
