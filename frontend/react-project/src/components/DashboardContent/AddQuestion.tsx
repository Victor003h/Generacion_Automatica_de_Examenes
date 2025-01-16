import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/AddQuestions.css";
import { Subject, Topic } from "../../components/Interfaces";

const AddQuestion: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("MO");
  const [difficulty, setDifficulty] = useState<string>("E");

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  useEffect(() => {
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
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/topic`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleSaveQuestion = async () => {
    const newQuestion = {
      content: questionText,
      type: questionType,
      difficulty: difficulty,
      teacher: userId,
      topic: selectedTopic,
    };

    try {
      await axios.post("http://localhost:8000/api/question/", newQuestion);
      alert("Pregunta guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };

  return (
    <div className="add-question-container">
      <h2>Añadir Pregunta</h2>
      <div className="form-group">
        <label>Asignatura:</label>
        <select
          onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
          value={selectedSubject || ""}
        >
          <option value="">Seleccione una asignatura</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Tema:</label>
        <select
          onChange={(e) => setSelectedTopic(parseInt(e.target.value))}
          value={selectedTopic || ""}
        >
          <option value="">Seleccione un tema</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Pregunta:</label>
        <textarea
          onChange={(e) => setQuestionText(e.target.value)}
          value={questionText}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Tipo de Pregunta:</label>
        <select
          onChange={(e) => setQuestionType(e.target.value)}
          value={questionType}
        >
          <option value="MO">Opciones Múltiples</option>
          <option value="E">Redacción</option>
          <option value="TF">Verdadero o Falso</option>
        </select>
      </div>
      <div className="form-group">
        <label>Nivel de Dificultad:</label>
        <select
          onChange={(e) => setDifficulty(e.target.value)}
          value={difficulty}
        >
          <option value="E">Fácil</option>
          <option value="M">Medio</option>
          <option value="D">Difícil</option>
        </select>
      </div>
      <button onClick={handleSaveQuestion} className="save-button">
        Guardar Pregunta
      </button>
    </div>
  );
};

export default AddQuestion;
