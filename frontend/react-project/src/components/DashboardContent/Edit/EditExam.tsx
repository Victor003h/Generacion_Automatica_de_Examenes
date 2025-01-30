import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/AddExam.css";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchSubjects from "../../../hooks/useFetchSubjects";
import useFetchTeachersBySubject from "../../../hooks/useFetchSubjectTeachers";
import BackButton from "../../BackButton";
import { Exam } from "../../Interfaces";

const EditExam: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;

  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [teacher, setTeacher] = useState<number | null>(null);
  const [subject, setSubject] = useState<number | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjects();
  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useFetchTeachersBySubject(subject);

  const role = localStorage.getItem("role") || "";
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam/${examId}/`
        );
        const exam: Exam = response.data;
        setType(exam.type);
        setDate(exam.date);
        setTeacher(exam.teacher);
        setSubject(exam.subject);
        setSelectedQuestions(exam.questions);
      } catch (err: unknown) {
        console.error("Error al obtener los detalles del examen:", err);
      }
    };

    fetchExamDetails();
  }, [examId]);

  const handleSaveExam = async () => {
    if (selectedQuestions.length === 0) {
      alert("Debe añadir al menos una pregunta al examen.");
      return;
    }

    const validationTeacherId =
      role === "admin"
        ? teacher
        : subjects.find((s) => s.id === subject)?.head_of_subject;

    const updatedExam = {
      type: type,
      date: date,
      teacher: role === "admin" ? teacher : userId,
      validation_teacher: validationTeacherId,
      subject: subject,
      questions: selectedQuestions,
    };

    try {
      await axios.put(`http://localhost:8000/api/exam/${examId}/`, updatedExam);
      alert("Examen actualizado exitosamente");

      if (role === "admin") {
        navigate("/admin-dashboard/exams");
      } else {
        navigate("/dashboard/exams");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al actualizar el examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al actualizar el examen:", err.message);
      } else {
        console.error("Error desconocido al actualizar el examen.");
      }
    }
  };

  const handleAddQuestions = async () => {
    try {
      const updatedExam = {
        type: type,
        date: date,
        teacher: role === "admin" ? teacher : userId,
        validation_teacher:
          role === "admin"
            ? teacher
            : subjects.find((s) => s.id === subject)?.head_of_subject,
        subject: subject,
        questions: selectedQuestions,
      };

      await axios.put(`http://localhost:8000/api/exam/${examId}/`, updatedExam);

      navigate("../edit-exam-questions", {
        state: { examId, type, date, teacher, subject, selectedQuestions },
      });
    } catch (err: unknown) {
      console.error(
        "Error al guardar el examen antes de añadir preguntas:",
        err
      );
    }
  };

  return (
    <div className="edit-exam-container">
      <BackButton />
      <h2>Editar Examen</h2>
      <div className="form-group">
        <label>Tipo:</label>
        <input
          type="text"
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
      </div>
      <div className="form-group">
        <label>Fecha de Creación:</label>
        <input type="text" value={date} readOnly />
      </div>
      <div className="form-group">
        <label>Asignatura:</label>
        {subjectsLoading ? (
          <p>Cargando asignaturas...</p>
        ) : subjectsError ? (
          <p>Error al cargar las asignaturas</p>
        ) : (
          <select
            onChange={(e) => setSubject(parseInt(e.target.value))}
            value={subject || ""}
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
      {role === "admin" && (
        <div className="form-group">
          <label>Profesor:</label>
          {teachersLoading ? (
            <p>Cargando profesores...</p>
          ) : teachersError ? (
            <p>Error al cargar los profesores</p>
          ) : (
            <select
              onChange={(e) => setTeacher(parseInt(e.target.value))}
              value={teacher || ""}
              disabled={!subject}
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
      <div className="form-group">
        <label>Preguntas añadidas:</label>
        <ul>
          {selectedQuestions.map((questionId) => (
            <li key={questionId}>Pregunta ID: {questionId}</li>
          ))}
        </ul>
        <button type="button" onClick={handleAddQuestions} disabled={!subject}>
          Añadir Preguntas
        </button>
      </div>
      <button onClick={handleSaveExam} className="save-button">
        Guardar Examen
      </button>
    </div>
  );
};

export default EditExam;
