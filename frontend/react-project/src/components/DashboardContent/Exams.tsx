import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/Exams.css";
import "../../styles/DashboardContent/Header.css";
import { Exam } from "../../components/Interfaces";

const Exams: React.FC = () => {
  const [examsBySubject, setExamsBySubject] = useState<Record<string, Exam[]>>(
    {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/exam");
        const exams = response.data;
        const examsWithSubjectNames = await Promise.all(
          exams.map(async (exam: Exam) => {
            const subjectResponse = await axios.get(
              `http://localhost:8000/api/subject/${exam.subject}`
            );
            return { ...exam, subjectName: subjectResponse.data.name };
          })
        );
        const groupedBySubject = examsWithSubjectNames.reduce(
          (acc: Record<string, Exam[]>, exam: Exam) => {
            if (!acc[exam.subject]) {
              acc[exam.subject] = [];
            }
            acc[exam.subject].push(exam);
            return acc;
          },
          {}
        );
        setExamsBySubject(groupedBySubject);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
      }
    };
    fetchExams();
  }, []);

  const handleDetailsClick = (examId: number) => {
    localStorage.setItem("examId", examId.toString());
    navigate("/exam-details");
  };

  return (
    <div className="content-container">
      <div className="header">
        <h2>Listado de Exámenes</h2>
        <button
          className="create-exam-button"
          onClick={() => (window.location.href = "/create-exam")}
        >
          Crear Examen
        </button>
      </div>
      {Object.keys(examsBySubject).map((subjectName) => (
        <div key={subjectName} className="subject-section">
          <h3>{subjectName}</h3>
          <table>
            <thead>
              <tr>
                <th>Creador</th> <th>Fecha de Creación</th> <th>Parámetros</th>
              </tr>
            </thead>
            <tbody>
              {examsBySubject[subjectName].map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.teacher}</td>
                  <td>{new Date(exam.date).toLocaleDateString()}</td>
                  <td>{exam.parameters}</td>
                  <td>
                    {" "}
                    <button
                      onClick={() => handleDetailsClick(exam.id)}
                      className="details-button"
                    >
                      {" "}
                      Detalles{" "}
                    </button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
export default Exams;
