import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/AddExam.css";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchSubjects from "../../../hooks/useFetchSubjects";
import useFetchTeachersBySubject from "../../../hooks/useFetchSubjectTeachers";
import BackButton from "../../BackButton";
import { Subject } from "../../Interfaces";

const AddExam: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState(location.state?.type || "");
  const [teacher, setTeacher] = useState<number | null>(
    location.state?.teacher || null
  );
  const [subject, setSubject] = useState<number | null>(
    location.state?.subject || null
  );
  const initialSelectedQuestions = location.state?.selectedQuestions || [];
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(
    initialSelectedQuestions
  );
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

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

  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]> ();
  
  useEffect(() => {
    const fetchFilteredSubjects = async () => {
      if (userId && role !== "admin") {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/teacher/subjects/${userId}/`);
          setFilteredSubjects(response.data);
        } catch (error) {
          console.error("Error fetching filtered subjects:", error);
        }
      } else {
        setFilteredSubjects(subjects);
      }
    };
    fetchFilteredSubjects();
  }, []);

  const handleSaveExam = async () => {
    if (selectedQuestions.length === 0) {
      alert("Debe añadir al menos una pregunta al examen.");
      return;
    }

    const validationTeacherId =
      role === "admin"
        ? teacher
        : subjects.find((s) => s.id === subject)?.head_of_subject;

    const newExam = {
      type: type,
      date: currentDate,
      state: "P",
      teacher: role === "admin" ? teacher : userId, // Usar el ID del usuario si es profesor
      validation_teacher: validationTeacherId,
      subject: subject,
      questions: selectedQuestions,
    };

    try {
      await axios.post("http://localhost:8000/api/exam/", newExam);
      alert("Examen añadido exitosamente");
      if (role === "admin") {
        navigate("/admin-dashboard/exams");
      } else {
        navigate("/dashboard/exams");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error al guardar el examen:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error al guardar el examen:", err.message);
      } else {
        console.error("Error desconocido al guardar el examen.");
      }
    }
  };

  const handleAddQuestions = () => {
    navigate("../add-exam-questions", {
      state: { type, currentDate, teacher, subject, selectedQuestions },
    });
  };

  return (
    <div className="add-exam-container">
      <BackButton />
      <h2>Añadir Examen</h2>
      <div className="form-group">
        <label>Tipo:</label>
        <input
          type="text"
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
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
            {filteredSubjects?.map((subject) => (
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

export default AddExam;
