import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/SetGradeExam.css";
import { Exam, Question, ExamDone, Teacher } from "../../Interfaces";

interface QuestionResponse {
  id: number;
  question: number;
  response: string;
  note: number;
  exam_Done: number;
}

// Componente para calificar un examen
const SetGradeExam: React.FC = () => {
  const location = useLocation();
  const { examDoneId } = location.state;
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [totalGrade, setTotalGrade] = useState<number>(0);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Obtener los detalles del examen realizado
  useEffect(() => {
    const fetchExamDoneDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam_done/${examDoneId}/`
        );
        const examDone: ExamDone = response.data;
        const examResponse = await axios.get(
          `http://localhost:8000/api/exam/${examDone.exam}/`
        );
        setExam(examResponse.data);
      } catch (error) {
        console.error("Error al obtener los detalles del examen realizado:", error);
      }
    };

    fetchExamDoneDetails();
  }, [examDoneId]);

  // Obtener las preguntas y respuestas del examen
  useEffect(() => {
    if (exam) {
      const fetchQuestions = async () => {
        try {
          const questionResponses = await axios.get(
            `http://localhost:8000/api/exam_done/questions/${examDoneId}/`
          );
          setResponses(questionResponses.data);
          const questionDetails: Question[] = await Promise.all(
            exam.questions.map(async (questionId) => {
              const response = await axios.get(
                `http://localhost:8000/api/question/${questionId}/`
              );
              return response.data;
            })
          );
          setQuestions(questionDetails);
        } catch (error) {
          console.error("Error al obtener las preguntas y respuestas:", error);
        }
      };

      fetchQuestions();
    }
  }, [exam, examDoneId]);

  // Obtener la lista de profesores si el usuario es administrador
  useEffect(() => {
    if (role === "admin") {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/account/teacher/"
          );
          setTeachers(response.data);
        } catch (error) {
          console.error("Error al obtener la lista de profesores:", error);
        }
      };

      fetchTeachers();
    }
  }, [role]);

  // Calcular la nota total del examen
  useEffect(() => {
    const total = responses.reduce((sum, response) => sum + response.note, 0);
    setTotalGrade(total);
  }, [responses]);

  // Manejar el cambio de nota de una respuesta
  const handleNoteChange = (responseId: number, note: number) => {
    setResponses((prevResponses) =>
      prevResponses.map((response) =>
        response.id === responseId ? { ...response, note } : response
      )
    );
  };

  // Manejar la calificación del examen
  const handleGradeExam = async () => {
    try {
      await Promise.all(
        responses.map((response) =>
          axios.put(
            `http://localhost:8000/api/exam_question_response/${response.id}/`,
            {
              response: response.response,
              note: response.note,
              exam_Done: response.exam_Done,
              question: response.question,
            }
          )
        )
      );

      const teacherId = role === "admin" ? selectedTeacher : userId;

      await axios.post("http://localhost:8000/api/exam_grade/", {
        finalnote: totalGrade,
        examdone: examDoneId,
        teacher: teacherId,
      });

      alert("Examen calificado con éxito");
      navigate("../view-exams-done");
    } catch (error) {
      console.error("Error al calificar el examen:", error);
    }
  };

  return (
    <div className="set-grade-exam-container">
      <h2>Calificar Examen</h2>
      {questions.map((question, index) => (
        <div key={question.id} className="question-container">
          <h3>{question.content}</h3>
          <p>Respuesta: {responses[index]?.response}</p>
          <label>
            Nota:
            <input
              type="number"
              value={responses[index]?.note || 0}
              onChange={(e) =>
                handleNoteChange(responses[index].id, Number(e.target.value))
              }
            />
          </label>
        </div>
      ))}
      <div className="total-grade-container">
        <label>
          Nota Total:
          <input type="number" value={totalGrade} readOnly />
        </label>
      </div>
      {role === "admin" && (
        <div className="teacher-select-container">
          <label>
            Seleccionar Profesor:
            <select
              value={selectedTeacher || ""}
              onChange={(e) => setSelectedTeacher(Number(e.target.value))}
            >
              <option value="">Seleccionar un profesor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <button onClick={handleGradeExam}>Calificar</button>
    </div>
  );
};

export default SetGradeExam;
