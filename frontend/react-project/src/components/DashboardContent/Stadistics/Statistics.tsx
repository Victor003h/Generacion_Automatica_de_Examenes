import React, { useState } from "react";
import "../../../styles/DashboardContent/Statistics.css";

const StatisticsView: React.FC = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleGenerateReport = () => {
    setShowExportOptions(true);
  };

  const handleExportToPDF = () => {
    // Lógica para exportar a PDF
    console.log("Exportando a PDF...");
    setShowExportOptions(false);
  };

  return (
    <div className="statistics-container">
      <h2>Estadísticas</h2>
      {/* Contenido de estadísticas aquí */}

      <button onClick={handleGenerateReport} className="generate-report-button">
        Generar Reporte
      </button>

      {showExportOptions && (
        <div className="export-options-container">
          <button onClick={handleExportToPDF} className="export-option-button">
            Exportar a PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default StatisticsView;
