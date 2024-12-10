import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Exams.css";

interface Exam {
  id: number;
  subject: string;
  date: string;
  type: string;
}

const Exams: React.FC = () => {
  const [examData, setExamData] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get<Exam[]>(
          `http://localhost:8000/api/exams/1`
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
      <h2>Exámenes Realizados</h2>
      <div className="exam-list">
        {examData.map((exam) => (
          <div key={exam.id} className="exam-card">
            <h3>{exam.subject}</h3>
            <p>
              <strong>Tipo:</strong> {exam.type}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(exam.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
