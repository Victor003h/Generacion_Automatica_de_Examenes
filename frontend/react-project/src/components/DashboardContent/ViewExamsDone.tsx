import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/ViewExams.css";
import { ExamDone, Exam, Student } from "../Interfaces";

const ViewExamsDone: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar si location.state es null
  const state = location.state as { subjectId: number } | null;
  const subjectId = state?.subjectId;

  const [examsDone, setExamsDone] = useState<ExamDone[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<{ [key: number]: Student }>({});

  useEffect(() => {
    if (!subjectId) {
      console.error("No subjectId provided.");
      return;
    }

    const fetchExamsDone = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam_done/ungraded/${subjectId}`
        );
        setExamsDone(response.data);
      } catch (error) {
        console.error("Error fetching ungraded exams:", error);
      }
    };

    fetchExamsDone();
  }, [subjectId]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      const examDetails: Exam[] = await Promise.all(
        examsDone.map(async (examDone) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/exam/${examDone.exam}/`
            );
            return response.data;
          } catch (error) {
            console.error("Error fetching exam details:", error);
            return null;
          }
        })
      );
      setExams(examDetails.filter((exam) => exam !== null) as Exam[]);
    };

    if (examsDone.length > 0) {
      fetchExamDetails();
    }
  }, [examsDone]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const studentDetails: { [key: number]: Student } = {};
      await Promise.all(
        examsDone.map(async (examDone) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/account/student/${examDone.student}`
            );
            studentDetails[examDone.student] = response.data;
          } catch (error) {
            console.error("Error fetching student details:", error);
          }
        })
      );
      setStudents(studentDetails);
    };

    if (examsDone.length > 0) {
      fetchStudentDetails();
    }
  }, [examsDone]);

  const handleGradeExam = (examDoneId: number) => {
    navigate("../set-grade-exam", { state: { examDoneId } });
  };

  if (!subjectId) {
    return (
      <div>
        No se ha proporcionado una asignatura válida para mostrar los exámenes.
      </div>
    );
  }

  return (
    <div className="view-exams-container">
      <h2>Exámenes a calificar</h2>
      {examsDone.length === 0 ? (
        <p>No hay exámenes a calificar para esta asignatura.</p>
      ) : (
        examsDone.map((examDone, index) => (
          <div key={examDone.id} className="exam-container">
            <h3>{exams[index]?.type}</h3>
            <p>Fecha: {exams[index]?.date}</p>
            <p>
              Estudiante: {students[examDone.student]?.first_name}{" "}
              {students[examDone.student]?.last_name}{" "}
              {students[examDone.student]?.last_name2}{" "}
            </p>
            <button onClick={() => handleGradeExam(examDone.id)}>
              Calificar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewExamsDone;
