import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/TeacherAnalysis.css";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/ExportButtons.css"; // Importar los estilos de exportación

interface TeacherAnalysisData {
  teacher: string;
  subject: string;
  num_exam_grade: number;
}

const TeacherAnalysis: React.FC = () => {
  const [months, setMonths] = useState<number>(3); // Valor inicial de 3 meses
  const [data, setData] = useState<TeacherAnalysisData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/teacher/exam_graded/detail/${months}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [months]);

  // Maneja el cambio en el número de meses
  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonths(Number(e.target.value));
  };

  // Maneja la exportación de datos en el formato especificado
  const handleExport = async (format: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/export/${format}/`,
        {
          title: "Análisis de Profesores",
          content: data,
        }
      );
      const blob = new Blob([response.data], { type: `application/${format}` });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      // Aquí podrías manejar la descarga del archivo o cualquier otra acción de éxito
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="teacher-analysis-container">
      <BackButton />
      <div className="header">
        <h1>Análisis de Profesores</h1>
        <div className="input-group">
          <label htmlFor="monthsInput">Número de meses:</label>
          <input
            type="number"
            id="monthsInput"
            value={months}
            onChange={handleMonthsChange}
          />
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
        <div className="analysis-cards">
          {data.map((item, index) => (
            <div key={index} className="analysis-card">
              <h2>Profesor: {item.teacher}</h2>
              <p>
                <strong>Asignatura:</strong> {item.subject}
              </p>
              <p>
                <strong>Número de Exámenes Calificados:</strong>{" "}
                {item.num_exam_grade}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherAnalysis;
