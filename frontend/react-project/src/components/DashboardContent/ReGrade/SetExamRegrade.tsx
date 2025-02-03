import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/SetGradeExam.css";
import { Exam, Question, ExamDone, Teacher, ExamGrade } from "../../Interfaces";

interface QuestionResponse {
  id: number;
  question: number;
  response: string;
  note: number;
  exam_Done: number;
}

const SetExamRegrade: React.FC = () => {
  const location = useLocation();
  const { reevaluatedExam, examGrade, examDone } = location.state;
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [totalGrade, setTotalGrade] = useState<number>(0);
  const role = localStorage.getItem("role");
  //const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const examResponse = await axios.get(
          `http://localhost:8000/api/exam/${examDone.exam}/`
        );
        setExam(examResponse.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExamDetails();
  }, [examDone]);

  useEffect(() => {
    if (exam) {
      const fetchQuestions = async () => {
        try {
          const questionResponses = await axios.get(
            `http://localhost:8000/api/exam_done/questions/${examDone.id}/`
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
          console.error("Error fetching questions and responses:", error);
        }
      };

      fetchQuestions();
    }
  }, [exam, examDone]);

  useEffect(() => {
    if (role === "admin") {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/account/teacher/"
          );
          setTeachers(response.data);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
      };

      fetchTeachers();
    }
  }, [role]);

  useEffect(() => {
    const total = responses.reduce((sum, response) => sum + response.note, 0);
    setTotalGrade(total);
  }, [responses]);

  const handleNoteChange = (responseId: number, note: number) => {
    setResponses((prevResponses) =>
      prevResponses.map((response) =>
        response.id === responseId ? { ...response, note } : response
      )
    );
  };

  const handleRegradeExam = async () => {
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

      // Actualizar el reevaluated_exam con la nueva nota
      await axios.put(
        `http://localhost:8000/api/reevaluated_exam/${reevaluatedExam.id}/`,
        {
          note: totalGrade.toString(),
          examgrade: reevaluatedExam.examgrade,
          teacher: reevaluatedExam.teacher,
        }
      );

      // Actualizar la nota final del exam_done
      await axios.put(`http://localhost:8000/api/exam_grade/${examGrade.id}/`, {
        finalnote: totalGrade.toString(),
        examdone: examGrade.examdone,
        teacher: examGrade.teacher,
      });

      alert("Examen recalificado exitosamente");
      navigate("../regrade-request");
    } catch (error) {
      console.error("Error regrading exam:", error);
    }
  };

  return (
    <div className="set-grade-exam-container">
      <h2>Recalificar Examen</h2>
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
      <button onClick={handleRegradeExam}>Recalificar</button>
    </div>
  );
};

export default SetExamRegrade;
