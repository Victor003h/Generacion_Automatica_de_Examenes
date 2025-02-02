import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/ViewExams.css";
import { ExamDone, Exam, Student, ExamGrade } from "../Interfaces";

const ViewExamsDone: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId } = location.state;
  const [examsDone, setExamsDone] = useState<ExamDone[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<{ [key: number]: Student }>({});
  const [examGrades, setExamGrades] = useState<{ [key: number]: ExamGrade }>(
    {}
  );

  useEffect(() => {
    const fetchExamsDone = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/subject/exams_done/${subjectId}/`
        );
        setExamsDone(response.data);
      } catch (error) {
        console.error("Error fetching completed exams:", error);
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

  useEffect(() => {
    const fetchExamGrades = async () => {
      const examGradeDetails: { [key: number]: ExamGrade } = {};
      await Promise.all(
        examsDone.map(async (examDone) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/exam_done/exam_grade/${examDone.id}/`
            );
            examGradeDetails[examDone.id] = response.data;
          } catch (error) {
            console.error("Error fetching exam grade details:", error);
          }
        })
      );
      setExamGrades(examGradeDetails);
    };

    if (examsDone.length > 0) {
      fetchExamGrades();
    }
  }, [examsDone]);

  const handleGradeExam = (examDoneId: number) => {
    navigate("../set-grade-exam", { state: { examDoneId } });
  };

  return (
    <div className="view-exams-container">
      <h2>Exámenes a calificar</h2>
      {exams.length === 0 ? (
        <p>No hay exámenes a calificar para esta asignatura.</p>
      ) : (
        examsDone.map((examDone, index) => {
          const examGrade = examGrades[examDone.id];
          if (examGrade?.finalnote !== null) {
            return null; // Skip exams with non-null notes
          }
          return (
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
          );
        })
      )}
    </div>
  );
};

export default ViewExamsDone;
