import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/ExamResults.css";
import { ExamDone, Exam, Teacher } from "../../Interfaces";

interface ExamGrade {
  id: number;
  finalnote: number;
  examdone: number;
  teacher: number;
}

interface ReevaluatedExam {
  id: number;
  note: number | null;
  examgrade: number;
  teacher: number;
}

const ExamResults: React.FC = () => {
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [teachers, setTeachers] = useState<{ [key: number]: string }>({});
  const [showRegradeForm, setShowRegradeForm] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [subjectTeachers, setSubjectTeachers] = useState<{
    [key: number]: Teacher[];
  }>({});
  const [reevaluatedExams, setReevaluatedExams] = useState<{
    [key: number]: ReevaluatedExam | null;
  }>({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchExamGrades = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/student/exams_grade/${userId}/`
        );
        setExamGrades(response.data);
      } catch (error) {
        console.error("Error fetching exam grades:", error);
      }
    };

    fetchExamGrades();
  }, [userId]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      const examDetails: Exam[] = await Promise.all(
        examGrades.map(async (examGrade) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/exam_done/${examGrade.examdone}/`
            );
            const examDone: ExamDone = response.data;
            const examResponse = await axios.get(
              `http://localhost:8000/api/exam/${examDone.exam}/`
            );
            return examResponse.data;
          } catch (error) {
            console.error("Error fetching exam details:", error);
            return null;
          }
        })
      );
      setExams(examDetails.filter((exam) => exam !== null) as Exam[]);
    };

    if (examGrades.length > 0) {
      fetchExamDetails();
    }
  }, [examGrades]);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      const teacherDetails: { [key: number]: string } = {};
      await Promise.all(
        examGrades.map(async (examGrade) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/account/teacher/${examGrade.teacher}`
            );
            const teacher: Teacher = response.data;
            teacherDetails[
              examGrade.teacher
            ] = `${teacher.first_name} ${teacher.last_name}`;
          } catch (error) {
            console.error("Error fetching teacher details:", error);
          }
        })
      );
      setTeachers(teacherDetails);
    };

    if (examGrades.length > 0) {
      fetchTeacherDetails();
    }
  }, [examGrades]);

  useEffect(() => {
    const fetchSubjectTeachers = async () => {
      const teachersBySubject: { [key: number]: Teacher[] } = {};
      await Promise.all(
        exams.map(async (exam) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/subject/teachers/${exam.subject}/`
            );
            teachersBySubject[exam.subject] = response.data;
          } catch (error) {
            console.error("Error fetching subject teachers:", error);
          }
        })
      );
      setSubjectTeachers(teachersBySubject);
    };

    if (exams.length > 0) {
      fetchSubjectTeachers();
    }
  }, [exams]);

  useEffect(() => {
    const fetchReevaluatedExams = async () => {
      const reevaluatedExamsData: { [key: number]: ReevaluatedExam | null } =
        {};
      await Promise.all(
        examGrades.map(async (examGrade) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/exam_grade/is_reevaluated/${examGrade.id}/`
            );
            if (!response.data.reevaluated) {
              const reevaluatedExamResponse = await axios.get(
                `http://localhost:8000/api/examgrade/re_evaluated_exam/${examGrade.id}/`
              );
              reevaluatedExamsData[examGrade.id] = reevaluatedExamResponse.data;
            } else {
              reevaluatedExamsData[examGrade.id] = null;
            }
          } catch (error) {
            console.error("Error fetching reevaluated exams:", error);
          }
        })
      );
      setReevaluatedExams(reevaluatedExamsData);
    };

    if (examGrades.length > 0) {
      fetchReevaluatedExams();
    }
  }, [examGrades]);

  const handleRequestRegrade = (examGradeId: number) => {
    setShowRegradeForm(examGradeId);
  };

  const handleSubmitRegrade = async (examGradeId: number) => {
    if (selectedTeacher === null) return;

    try {
      await axios.post(`http://localhost:8000/api/reevaluated_exam/`, {
        note: "",
        examgrade: examGradeId,
        teacher: selectedTeacher,
      });
      alert("Solicitud de recalificación enviada exitosamente");
      setShowRegradeForm(null);
      setSelectedTeacher(null);
    } catch (error) {
      console.error("Error submitting regrade request:", error);
    }
  };

  return (
    <div className="exam-results-container">
      <h2>Resultados de Exámenes</h2>
      {examGrades.length === 0 ? (
        <p>No hay resultados de exámenes disponibles.</p>
      ) : (
        examGrades.map((examGrade, index) => (
          <div key={examGrade.id} className="exam-result-container">
            <h3>{exams[index]?.type}</h3>
            <p>Fecha: {exams[index]?.date}</p>
            <p>Nota Final: {examGrade.finalnote}</p>
            <p>Profesor: {teachers[examGrade.teacher]}</p>
            {reevaluatedExams[examGrade.id] ? (
              reevaluatedExams[examGrade.id]?.note === null ? (
                <p>Recalificación solicitada</p>
              ) : (
                <p>Examen recalificado</p>
              )
            ) : (
              <button
                onClick={() => handleRequestRegrade(examGrade.id)}
                className="request-regrade-button"
              >
                Solicitar Recalificación
              </button>
            )}
            {showRegradeForm === examGrade.id && (
              <div className="regrade-form">
                <label>Seleccione un Profesor:</label>
                <select
                  onChange={(e) => setSelectedTeacher(parseInt(e.target.value))}
                  value={selectedTeacher || ""}
                >
                  <option value="">Seleccione un profesor</option>
                  {subjectTeachers[exams[index]?.subject]?.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSubmitRegrade(examGrade.id)}
                  className="submit-regrade-button"
                >
                  Enviar Solicitud
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ExamResults;
