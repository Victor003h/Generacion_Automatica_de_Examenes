import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/AddQuestions.css";
import useFetchSubjectsByRole from "../../hooks/useFetchSubjectsByRole"; // Importa el nuevo hook
import useFetchTopics from "../../hooks/useFetchSubjectTopics"; // Importa el hook

const EditQuestion: React.FC = () => {
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? storedUserId : null;
  const role = localStorage.getItem("role") || ""; // Obtener el role desde localstorage
  const questionId = localStorage.getItem("editQuestionId") || "";
  const [questionData, setQuestionData] = useState({
    date: "",
    topic: null,
    type: "MO",
    difficulty: "E",
    content: "",
    teacher: role === "admin" ? null : userId,
    subject: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjectsByRole(userId, role);

  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
  } = useFetchTopics(questionData.subject);

  const [teachers, setTeachers] = useState<
    { id: number; first_name: string; last_name: string }[]
  >([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/teacher/"
        );
        setTeachers(response.data);
        setTeachersLoading(false);
      } catch (error) {
        setTeachersError("Error al cargar los profesores");
        setTeachersLoading(false);
      }
    };

    if (role === "admin") {
      fetchTeachers();
    } else {
      setTeachersLoading(false);
    }
  }, [role]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/question/${questionId}/`
        );
        const question = response.data;
        setQuestionData({
          date: question.date,
          topic: question.topic,
          type: question.type,
          difficulty: question.difficulty,
          content: question.content,
          teacher: question.teacher,
          subject: question.subject,
        });
      } catch (error) {
        console.error("Error al obtener la pregunta:", error);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuestionData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuestionData = {
      ...questionData,
      date: new Date().toISOString().split("T")[0],
    }; // Actualizar fecha a la actual
    try {
      await axios.put(
        `http://localhost:8000/api/question/${questionId}/`,
        updatedQuestionData
      );
      setSuccessMessage("Pregunta editada con éxito");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate(
          role === "admin"
            ? "/admin-dashboard/questions"
            : "/dashboard/questions"
        ); // Redirige según el rol
      }, 2000); // Redirigir después de 2 segundos
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
    }
  };

  return (
    <div className="add-question-container">
      <h2>Editar Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asignatura:</label>
          {subjectsLoading ? (
            <p>Cargando asignaturas...</p>
          ) : subjectsError ? (
            <p>Error al cargar las asignaturas</p>
          ) : (
            <select
              name="subject"
              onChange={handleChange}
              value={questionData.subject || ""}
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
              name="topic"
              onChange={handleChange}
              value={questionData.topic || ""}
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
            name="content"
            onChange={handleChange}
            value={questionData.content}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Tipo de Pregunta:</label>
          <select name="type" onChange={handleChange} value={questionData.type}>
            <option value="MO">Opciones Múltiples</option>
            <option value="E">Redacción</option>
            <option value="TF">Verdadero o Falso</option>
          </select>
        </div>
        <div className="form-group">
          <label>Nivel de Dificultad:</label>
          <select
            name="difficulty"
            onChange={handleChange}
            value={questionData.difficulty}
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
                name="teacher"
                onChange={handleChange}
                value={questionData.teacher || ""}
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
        <button type="submit" className="save-button">
          Guardar Cambios
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default EditQuestion;
