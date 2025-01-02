import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Subjects.css";

interface Subject {
  id: number;
  name: string;
  examsCount: number;
  averageScore: number;
}

const Subjects: React.FC = () => {
  const [subjectData, setSubjectData] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>(
          `http://localhost:8000/api/subject/`
        ); // Reemplaza '1' con el ID del profesor
        setSubjectData(response.data);
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="content-container">
      <h2>Asignaturas</h2>
      <div className="subject-list">
        {subjectData.map((subject) => (
          <div key={subject.id} className="subject-card">
            <div className="subject-details">
              <h3>{subject.name}</h3>
              <p>
                <strong>Exámenes:</strong> {subject.examsCount}
              </p>
              <p>
                <strong>Promedio:</strong> {subject.averageScore}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
