import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/DefineExamType.css";
import { Exam } from "../../Interfaces";

const DefineExamType: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDetails, setExamDetails] = useState<{
    [key: number]: { subjectName: string; teacherName: string };
  }>({});
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [examType, setExamType] = useState("");

  useEffect(() => {
    // Fetch validated exams
    axios.get("/api/exams/validated").then((response) => {
      if (Array.isArray(response.data)) {
        setExams(response.data);
      } else {
        console.error("Expected an array of exams");
      }
    }).catch(error => {
      console.error("Error fetching validated exams:", error);
    });
  }, []);

  useEffect(() => {
    const fetchExamDetails = async (
      examId: number,
      subjectId: number,
      teacherId: number
    ) => {
      try {
        const subjectResponse = await axios.get(
          `http://localhost:8000/api/subject/${subjectId}/`
        );
        const teacherResponse = await axios.get(
          `http://localhost:8000/api/account/teacher/${teacherId}`
        );
        setExamDetails((prevDetails) => ({
          ...prevDetails,
          [examId]: {
            subjectName: subjectResponse.data.name,
            teacherName: `${teacherResponse.data.first_name} ${teacherResponse.data.last_name}`,
          },
        }));
      } catch (error) {
        console.error(`Error al obtener detalles del examen ${examId}:`, error);
      }
    };

    exams.forEach((exam) => {
      fetchExamDetails(exam.id, exam.subject, exam.teacher);
    });
  }, [exams]);

  const handleDefineType = (examId: number) => {
    setSelectedExamId(examId);
  };

  const handleSubmit = () => {
    if (selectedExamId && examType) {
      axios
        .put(`/api/exams/${selectedExamId}/define-type`, { type: examType })
        .then((response) => {
          alert("Tipo de examen definido con éxito");
          setSelectedExamId(null);
          setExamType("");
        })
        .catch((error) => {
          console.error("Error al definir el tipo de examen:", error);
        });
    }
  };

  return (
    <div className="define-exam-type-container">
      <h2>Definir Tipo de Examen</h2>
      <div className="exam-list">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-item">
            <div className="exam-details">
              <h2>{exam.type}</h2>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(exam.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Profesor:</strong>{" "}
                {examDetails[exam.id]?.teacherName || "Cargando..."}
              </p>
              <p>
                <strong>Asignatura:</strong>{" "}
                {examDetails[exam.id]?.subjectName || "Cargando..."}
              </p>
            </div>
            <button onClick={() => handleDefineType(exam.id)}>Definir Tipo</button>
          </div>
        ))}
      </div>
      {selectedExamId && (
        <div className="define-type-form">
          <h3>Definir Tipo para el Examen ID: {selectedExamId}</h3>
          <input
            type="text"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            placeholder="Ingrese el tipo de examen"
          />
          <button onClick={handleSubmit}>Guardar</button>
        </div>
      )}
    </div>
  );
};

export default DefineExamType;
