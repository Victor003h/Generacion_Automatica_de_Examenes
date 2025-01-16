import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "../../styles/DashboardContent/CreateExam.css";
import { Subject, Topic, Question } from "../../components/Interfaces";

const CreateExam: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [examType, setExamType] = useState<string>("");
  const [parameters, setParameters] = useState<string>("");

  useEffect(() => {
    // Obtener todas las asignaturas
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subject");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    // Obtener todos los temas (independiente de la asignatura)
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/topic");
        setTopics(response.data);
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    };

    fetchTopics();
  }, []);

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
    // Recuperar el ID del profesor del localStorage
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
      //questionIds: selectedQuestions,
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
          <select
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            required
          >
            <option value="">Selecciona una asignatura</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tema</label>
          <select
            onChange={(e) => setSelectedTopic(Number(e.target.value))}
            required
          >
            <option value="">Selecciona un tema</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
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
