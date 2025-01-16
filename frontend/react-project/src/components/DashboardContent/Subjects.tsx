import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardContent/Subjects.css";
import { Subject } from "../../components/Interfaces";

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
      <div className="header">
        <h2>Asignaturas</h2>
      </div>
      <div className="card-container">
        {subjectData.map((subject) => (
          <div key={subject.id} className="card">
            <h3>{subject.name}</h3> <p>Curso: {subject.course}</p>
            <p>Programa de Estudio: {subject.study_program}</p>
            <p>{subject.head_of_subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
