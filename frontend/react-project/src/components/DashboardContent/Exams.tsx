import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Exams.css";

interface Exam {
  id: 0;
  type: "string";
  validation: true;
  parameters: "string";
  date: "2024-12-10";
  teacher: 0;
  subject: 0;
}

const Exams: React.FC = () => {
  const [examData, setExamData] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get<Exam[]>(
          `http://localhost:8000/api/exam/`
        ); // Reemplaza '1' con el ID del profesor
        setExamData(response.data);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="content-container">
      <h2>Exámenes Generados</h2>
      <div className="exam-list">
        {examData.map((exam) => (
          <div key={exam.id} className="exam-card">
            <div key={exam.id} className="exam-details">
              <p>
                <strong>Asignatura:</strong> {exam.subject}
                {/*Aqui pedir un
                consulta que devuelva el nombre de asignatura por id*/}
              </p>
              <p>
                <strong>Tipo:</strong> {exam.type}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(exam.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
