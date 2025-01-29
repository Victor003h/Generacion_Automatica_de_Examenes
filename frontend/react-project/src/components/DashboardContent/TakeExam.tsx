import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/TakeExam.css";
import { Question } from "../Interfaces";

const TakeExam: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, validatedExamId } = location.state;

  const userId = localStorage.getItem("userId") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!examId) {
      navigate("/student-dashboard");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam/${examId}/`
        );
        const questionIds: number[] = response.data.questions || [];

        if (questionIds.length > 0) {
          const questionPromises = questionIds.map((id) =>
            axios
              .get(`http://localhost:8000/api/question/${id}/`)
              .then((res) => res.data)
          );

          const questionsData = await Promise.all(questionPromises);
          setQuestions(questionsData);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examId, navigate]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleFinishExam = async () => {
    try {
      // Crear el examen respondido
      const examDoneResponse = await axios.post(
        `http://localhost:8000/api/exam_done/`,
        {
          date: new Date().toISOString().split("T")[0],
          validated_exam: validatedExamId,
          student: parseInt(userId),
        }
      );

      const examDoneId = examDoneResponse.data.id;

      // Guardar las respuestas de las preguntas
      const promises = questions.map((question) =>
        axios.post(`http://localhost:8000/api/exam_question_response/`, {
          response: answers[question.id] || "",
          observation: "",
          exam_done: examDoneId,
          question: question.id,
        })
      );

      await Promise.all(promises);

      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error submitting exam answers:", error);
    }
  };

  return (
    <div className="take-exam-container">
      <h1>Responder Examen</h1>
      {questions.length === 0 ? (
        <p>No hay preguntas disponibles para este examen.</p>
      ) : (
        <ul className="question-list">
          {questions.map((question) => (
            <li key={question.id} className="question-item">
              <p>{question.content}</p>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                placeholder="Escribe tu respuesta aquí..."
              />
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleFinishExam} className="finish-exam-button">
        Finalizar Examen
      </button>
    </div>
  );
};

export default TakeExam;
