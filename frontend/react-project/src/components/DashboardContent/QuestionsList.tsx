import React from "react";
import useFetchSubjects from "../../hooks/useFetchTeacherSubjects";
import useFetchQuestions from "../../hooks/useFetchQuestions";
import { Link } from "react-router-dom";
import "../../styles/DashboardContent/QuestionsList.css";
import { Subject } from "../../components/Interfaces";

const QuestionList: React.FC = () => {
  const teacherId = localStorage.getItem("userId") || "";
  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjects(teacherId);
  const subjectIds = subjects.map((subject: Subject) => subject.id);
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
  } = useFetchQuestions(subjectIds);
  if (subjectsLoading || questionsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;
  if (questionsError) return <div>{questionsError}</div>;
  return (
    <div className="content-container">
      {" "}
      <div className="header">
        {" "}
        <h2>Listado de Preguntas</h2>{" "}
        <Link to="/add-question" className="add-button">
          {" "}
          Añadir Pregunta{" "}
        </Link>{" "}
      </div>{" "}
      {subjects.map((subject: Subject) => (
        <div key={subject.id} className="subject-container">
          {" "}
          <div className="subject-header">
            {" "}
            <h2>{subject.name}</h2>{" "}
          </div>{" "}
          <div className="question-list">
            {" "}
            {questions[subject.id] && questions[subject.id].length > 0 ? (
              questions[subject.id].map((question) => (
                <div key={question.id} className="question-item">
                  {" "}
                  <div className="question-header">
                    {" "}
                    <span>
                      <strong>Fecha:</strong> {question.date}
                    </span>{" "}
                    <span>
                      <strong>Tema:</strong> {question.topic}
                    </span>{" "}
                    <span>
                      <strong>Tipo:</strong> {question.type}
                    </span>{" "}
                    <span>
                      <strong>Dificultad:</strong> {question.difficulty}
                    </span>{" "}
                  </div>{" "}
                  <div className="question-text">
                    {" "}
                    <p>{question.content}</p>{" "}
                  </div>{" "}
                </div>
              ))
            ) : (
              <div className="question-item">No hay preguntas disponibles</div>
            )}{" "}
          </div>{" "}
        </div>
      ))}{" "}
    </div>
  );
};
export default QuestionList;
