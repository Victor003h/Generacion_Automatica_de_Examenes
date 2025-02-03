import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/AddExam.css";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchTeachersBySubject from "../../../hooks/useFetchSubjectTeachers";
import BackButton from "../../BackButton";
import { Exam, Subject } from "../../Interfaces";

// Component for editing exam details
const EditExam: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;
  const role = localStorage.getItem("role") || "";
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;

  // State variables for exam details
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [teacher, setTeacher] = useState<number | null>(null);
  const [subject, setSubject] = useState<number | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [states, setStates] = useState("");
  const [validation_date, setValidationDate] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>();
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<unknown>(null);

  // Fetch teachers based on selected subject
  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useFetchTeachersBySubject(subject);

  // Fetch exam details on component mount
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
        setStates(exam.state);
        setValidationDate(exam.validation_date);
      } catch (err: unknown) {
        console.error("Error fetching exam details:", err);
      }
    };

    fetchExamDetails();
  }, [examId]);

  // Fetch subjects based on teacher
  useEffect(() => {
    const fetchSubjectsByTeacher = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/teacher/subjects/${userId}/`
          );
          setSubjects(response.data);
        } catch (err: unknown) {
          setSubjectsError(err);
        } finally {
          setSubjectsLoading(false);
        }
      }
    };

    fetchSubjectsByTeacher();
  }, [userId]);

  // Ensure selected questions belong to the selected subject
  useEffect(() => {
    const questionsubject = async () => {
      const questionid: number = selectedQuestions[0];
      try {
        const response = await axios.get(
          `http://localhost:8000/api/question/${questionid}/`
        );
        const questionsubjectid = response.data.subject;
        return questionsubjectid;
      } catch (err: unknown) {
        console.error("Error fetching question subject:", err);
      }
    };

    const fetchSubjectId = async () => {
      const subject_id = await questionsubject();
      if (subject !== subject_id) {
        setSelectedQuestions([]);
      }
    };

    if (selectedQuestions.length > 0) fetchSubjectId();
  }, [subject]);

  // Handle saving exam details
  const handleSaveExam = async () => {
    if (selectedQuestions.length === 0) {
      alert("Debe añadir al menos una pregunta al examen.");
      return;
    }

    const validationTeacherId =
      role === "admin"
        ? teacher
        : subjects?.find((s) => s.id === subject)?.head_of_subject;

    const updatedExam = {
      type: type,
      validation_date: validation_date,
      state: states === "R" ? "P" : states,
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
          "Error updating exam:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error updating exam:", err.message);
      } else {
        console.error("Unknown error updating exam.");
      }
    }
  };

  // Handle adding questions to the exam
  const handleAddQuestions = async () => {
    try {
      const updatedExam = {
        type: type,
        states: states,
        teacher: role === "admin" ? teacher : userId,
        validation_date: validation_date,
        validation_teacher:
          role === "admin"
            ? teacher
            : subjects?.find((s) => s.id === subject)?.head_of_subject,
        subject: subject,
        questions: selectedQuestions,
      };

      await axios.put(`http://localhost:8000/api/exam/${examId}/`, updatedExam);

      navigate("../edit-exam-questions", {
        state: { examId, type, date, teacher, subject, selectedQuestions },
      });
    } catch (err: unknown) {
      console.error("Error saving exam before adding questions:", err);
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
            {subjects?.map((subject) => (
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
