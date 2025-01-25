import React, { useState } from "react";
import axios from "axios";
import "../../styles/DashboardContent/AddQuestions.css";
import useFetchSubjectsByRole from "../../hooks/useFetchSubjectsByRole"; // Importa el nuevo hook
import useFetchTopics from "../../hooks/useFetchSubjectTopics"; // Importa el hook
import useFetchTeachersBySubject from "../../hooks/useFetchSubjectTeachers"; // Importa el hook

const AddQuestion: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("MO");
  const [difficulty, setDifficulty] = useState<string>("E");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null); // Nuevo estado para el profesor seleccionado

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? storedUserId : null;
  const role = localStorage.getItem("role") || ""; // Obtener el role desde localstorage

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjectsByRole(userId, role);

  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
  } = useFetchTopics(selectedSubject);

  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useFetchTeachersBySubject(selectedSubject); // Usar el nuevo hook

  const handleSaveQuestion = async () => {
    const newQuestion = {
      content: questionText,
      type: questionType,
      difficulty: difficulty,
      teacher: role === "admin" ? selectedTeacher : userId, // Utilizar el profesor seleccionado si es admin
      topic: selectedTopic,
      subject: selectedSubject,
    };
    try {
      await axios.post("http://localhost:8000/api/question/", newQuestion);
      alert("Pregunta guardada exitosamente");
      setQuestionText("");
      setQuestionType("MO");
      setDifficulty("E");
      setSelectedSubject(null);
      setSelectedTopic(null);
      setSelectedTeacher(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al guardar la pregunta:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al guardar la pregunta:", err.message);
      } else {
        console.error("Error desconocido al guardar la pregunta.");
      }
    }
  };

  return (
    <div className="add-question-container">
      <h2>Añadir Pregunta</h2>
      <div className="form-group">
        <label>Asignatura:</label>
        {subjectsLoading ? (
          <p>Cargando asignaturas...</p>
        ) : subjectsError ? (
          <p>Error al cargar las asignaturas</p>
        ) : (
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
        )}
      </div>
      <div className="form-group">
        <label>Tema:</label>
        {topicsLoading ? (
          <p>Cargando temas...</p>
        ) : topicsError ? (
          <p>Error al cargar los temas</p>
        ) : (
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
        )}
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
      {role === "admin" && ( // Mostrar el campo de selección de profesor solo si el usuario es admin
        <div className="form-group">
          <label>Profesor Autor:</label>
          {teachersLoading ? (
            <p>Cargando profesores...</p>
          ) : teachersError ? (
            <p>{teachersError}</p>
          ) : (
            <select
              onChange={(e) => setSelectedTeacher(e.target.value)}
              value={selectedTeacher || ""}
            >
              <option value="">Seleccione un profesor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      <button onClick={handleSaveQuestion} className="save-button">
        Guardar Pregunta
      </button>
    </div>
  );
};

export default AddQuestion;
