import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/RegradeRequest.css";
import { ExamGrade, ExamDone } from "../../Interfaces";

interface ReevaluatedExam {
  id: number;
  note: string | null;
  examgrade: number;
  teacher: number;
}

// Componente funcional para mostrar solicitudes de recalificación de exámenes
const RegradeRequest: React.FC = () => {
  const [reevaluatedExams, setReevaluatedExams] = useState<ReevaluatedExam[]>(
    []
  );
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([]);
  const [examDones, setExamDones] = useState<ExamDone[]>([]);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Efecto para obtener las solicitudes de recalificación al montar el componente
  useEffect(() => {
    const fetchReevaluatedExams = async () => {
      try {
        const url =
          role === "admin"
            ? `http://localhost:8000/api/reevaluated_exam/`
            : `http://localhost:8000/api/teacher/re_evaluated_exam/${userId}/`;

        const response = await axios.get(url);
        const filteredExams: ReevaluatedExam[] = response.data.filter(
          (exam: ReevaluatedExam) => exam.note === null
        );
        setReevaluatedExams(filteredExams);

        const examGradePromises = filteredExams.map(
          async (exam: ReevaluatedExam) => {
            const examGradeResponse = await axios.get(
              `http://localhost:8000/api/exam_grade/${exam.examgrade}/`
            );
            return examGradeResponse.data;
          }
        );

        const examGrades = await Promise.all(examGradePromises);
        setExamGrades(examGrades);

        const examDonePromises = examGrades.map(async (grade) => {
          const examDoneResponse = await axios.get(
            `http://localhost:8000/api/exam_done/${grade.examdone}/`
          );
          return examDoneResponse.data;
        });

        const examDones = await Promise.all(examDonePromises);
        setExamDones(examDones);
      } catch (error) {
        console.error("Error fetching reevaluated exams:", error);
      }
    };

    fetchReevaluatedExams();
  }, [userId, role]);

  // Manejar la acción de recalificar un examen
  const handleRegrade = (
    reevaluatedExam: ReevaluatedExam,
    examGrade: ExamGrade,
    examDone: ExamDone
  ) => {
    navigate("../set-exam-regrade", {
      state: { reevaluatedExam, examGrade, examDone },
    });
  };

  return (
    <div className="recalificar-examenes-container">
      <h2>Recalificar Exámenes</h2>
      {reevaluatedExams.length === 0 ? (
        <p>No hay solicitudes de recalificación disponibles.</p>
      ) : (
        reevaluatedExams.map((exam, index) => (
          <div key={exam.id} className="exam-container">
            <h3>Examen ID: {examDones[index]?.id}</h3>
            <p>Nota Actual: {examGrades[index]?.finalnote}</p>
            <button
              onClick={() =>
                handleRegrade(exam, examGrades[index], examDones[index])
              }
              className="regrade-button"
            >
              Recalificar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RegradeRequest;
