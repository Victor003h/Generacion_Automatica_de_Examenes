import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/CreateExam.css";
import { Question } from "../../Interfaces";
import useFetchSubjects from "../../../hooks/useFetchTeacherSubjects"; // Importa el hook
import useFetchTopics from "../../../hooks/useFetchSubjectTopics"; // Importa el hook

const CreateExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [examType, setExamType] = useState<string>("");
  const [parameters, setParameters] = useState<string>("");

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? storedUserId : null;

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjects(Number(userId));
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
  } = useFetchTopics(selectedSubject);

  useEffect(() => {
    if (selectedTopic !== null) {
      // Obtener las preguntas del tema seleccionado
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/question?topic=${selectedTopic}`
          );
          setQuestions(response.data);
        } catch (error) {
          console.error("Error al obtener las preguntas:", error);
        }
      };

      fetchQuestions();
    }
  }, [selectedTopic]);

  const handleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const storedTeacherId = localStorage.getItem("userId");
    const teacherId = storedTeacherId ? parseInt(storedTeacherId, 10) : null;

    if (teacherId === null) {
      alert("No se encontró el ID del profesor. Por favor, inicie sesión.");
      return;
    }

    const newExam = {
      type: examType,
      validation: false,
      parameters: parameters,
      teacher: teacherId,
      subject: selectedSubject,
      questionIds: selectedQuestions, // Descomentar esta línea
    };

    try {
      await axios.post("http://localhost:8000/api/exam", newExam, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Examen creado con éxito");
    } catch (error) {
      console.error("Error al crear el examen:", error);
    }
  };

  return (
    <div className="content-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asignatura</label>
          {subjectsLoading ? (
            <p>Cargando asignaturas...</p>
          ) : (
            <select
              onChange={(e) => setSelectedSubject(Number(e.target.value))}
              required
            >
              <option value="">Selecciona una asignatura</option>
              {subjects.length === 0 ? (
                <option value="">No se encontraron asignaturas</option>
              ) : (
                subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))
              )}
            </select>
          )}
          {subjectsError && <p>{subjectsError}</p>}
        </div>
        <div className="form-group">
          <label>Tema</label>
          {topicsLoading ? (
            <p>Cargando temas...</p>
          ) : (
            <select
              onChange={(e) => setSelectedTopic(Number(e.target.value))}
              required
            >
              <option value="">Selecciona un tema</option>
              {topics.length === 0 ? (
                <option value="">No se encontraron temas</option>
              ) : (
                topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))
              )}
            </select>
          )}
          {topicsError && <p>{topicsError}</p>}
        </div>
        <div className="form-group">
          <label>Preguntas</label>
          <ul className="question-list">
            {questions.map((question) => (
              <li key={question.id}>
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => handleQuestionSelection(question.id)}
                />
                {question.content} (Dificultad: {question.difficulty})
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Tipo de Examen</label>
          <input
            type="text"
            onChange={(e) => setExamType(e.target.value)}
            value={examType}
          />
        </div>
        <div className="form-group">
          <label>Parámetros</label>
          <textarea
            onChange={(e) => setParameters(e.target.value)}
            value={parameters}
          ></textarea>
        </div>
        <button type="submit">Crear Examen</button>
      </form>
    </div>
  );
};

export default CreateExam;
